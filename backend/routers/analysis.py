from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import os
import re
from pydantic import BaseModel

from database import get_db
from models.upload import Upload
from models.user import User
from security import get_current_user

router = APIRouter(prefix="/uploads", tags=["Analysis"])

class QueryRequest(BaseModel):
    question: str

@router.get("/{upload_id}/insights")
def get_insights(
    upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    if not os.path.exists(upload.filepath):
        raise HTTPException(status_code=404, detail="Physical file not found on server")

    try:
        ext = os.path.splitext(upload.filepath)[1].lower()
        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(upload.filepath)
        else:
            df = pd.read_csv(upload.filepath)

        total_cells = int(df.shape[0] * df.shape[1])
        if total_cells == 0:
            return {"data_quality": 100, "insights": [], "summary_stats": {}}

        # Calculate Quality Metrics
        missing_count = int(df.isnull().sum().sum())
        duplicate_rows = int(df.duplicated().sum())
        
        missing_pct = missing_count / total_cells
        duplicate_pct = duplicate_rows / len(df) if len(df) > 0 else 0

        # Health index
        quality_score = max(0, min(100, int((1 - (missing_pct * 0.7 + duplicate_pct * 0.3)) * 100)))

        # Identify column types
        numeric_cols = []
        categorical_cols = []
        datetime_cols = []
        
        column_summaries = {}
        for col in df.columns:
            # Check datatype
            col_data = df[col]
            null_cnt = int(col_data.isnull().sum())
            unique_cnt = int(col_data.nunique())
            
            # Clean values for type checking
            non_null_data = col_data.dropna()
            
            # Simple heuristics for types
            is_num = pd.api.types.is_numeric_dtype(non_null_data)
            
            if is_num and unique_cnt > 1:
                numeric_cols.append(col)
                summary = {
                    "type": "numeric",
                    "null_count": null_cnt,
                    "unique_count": unique_cnt,
                    "mean": float(non_null_data.mean()) if len(non_null_data) > 0 else 0.0,
                    "min": float(non_null_data.min()) if len(non_null_data) > 0 else 0.0,
                    "max": float(non_null_data.max()) if len(non_null_data) > 0 else 0.0,
                    "std": float(non_null_data.std()) if len(non_null_data) > 1 else 0.0
                }
            else:
                # Try parsing as datetime
                try:
                    import warnings
                    with warnings.catch_warnings():
                        warnings.simplefilter("ignore")
                        pd.to_datetime(non_null_data.head(5), errors="raise")
                    datetime_cols.append(col)
                    summary = {
                        "type": "datetime",
                        "null_count": null_cnt,
                        "unique_count": unique_cnt,
                    }
                except:
                    categorical_cols.append(col)
                    top_val = non_null_data.mode().iloc[0] if len(non_null_data) > 0 else None
                    top_freq = int((non_null_data == top_val).sum()) if top_val is not None else 0
                    summary = {
                        "type": "categorical",
                        "null_count": null_cnt,
                        "unique_count": unique_cnt,
                        "top_value": str(top_val) if top_val is not None else None,
                        "top_frequency": top_freq
                    }
            column_summaries[col] = summary

        # Find Correlations
        correlations = []
        if len(numeric_cols) >= 2:
            corr_matrix = df[numeric_cols].corr()
            for i in range(len(numeric_cols)):
                for j in range(i + 1, len(numeric_cols)):
                    c_val = corr_matrix.iloc[i, j]
                    if not pd.isna(c_val) and abs(c_val) > 0.4:
                        correlations.append({
                            "col1": numeric_cols[i],
                            "col2": numeric_cols[j],
                            "coefficient": round(float(c_val), 3)
                        })
            # Sort by absolute strength of correlation
            correlations.sort(key=lambda x: abs(x["coefficient"]), reverse=True)

        # Detect Outliers (IQR method)
        outliers_log = {}
        for col in numeric_cols:
            non_null = df[col].dropna()
            if len(non_null) > 4:
                q25, q75 = np.percentile(non_null, [25, 75])
                iqr = q75 - q25
                lower_bound = q25 - 1.5 * iqr
                upper_bound = q75 + 1.5 * iqr
                
                outliers = non_null[(non_null < lower_bound) | (non_null > upper_bound)]
                if len(outliers) > 0:
                    outliers_log[col] = {
                        "count": len(outliers),
                        "percentage": round((len(outliers) / len(df)) * 100, 2),
                        "bounds": [float(lower_bound), float(upper_bound)]
                    }

        # Structure AI Findings
        findings = []
        findings.append(f"Analyzed {df.shape[0]} rows and {df.shape[1]} columns. Overall data quality health index is {quality_score}%.")
        
        if duplicate_rows > 0:
            findings.append(f"⚠️ Found {duplicate_rows} duplicate rows ({round(duplicate_pct*100, 2)}%). Consider cleaning duplicates.")
            
        for col, summary in column_summaries.items():
            if summary["null_count"] > 0:
                pct = round((summary["null_count"] / len(df)) * 100, 2)
                findings.append(f"⚠️ Column '{col}' has {summary['null_count']} missing values ({pct}%).")

        for col, info in outliers_log.items():
            if info["percentage"] > 2:
                findings.append(f"📊 Column '{col}' contains {info['count']} outliers ({info['percentage']}%). These extreme values may skew averages.")

        for corr in correlations[:3]:
            strength = "strong" if abs(corr["coefficient"]) > 0.7 else "moderate"
            direction = "positive" if corr["coefficient"] > 0 else "negative"
            findings.append(f"🔗 Detected {strength} {direction} correlation of {corr['coefficient']} between '{corr['col1']}' and '{corr['col2']}'.")

        return {
            "id": upload.id,
            "filename": upload.filename,
            "rows": len(df),
            "columns": len(df.columns),
            "data_quality": quality_score,
            "missing_cells": missing_count,
            "duplicate_rows": duplicate_rows,
            "numeric_columns_count": len(numeric_cols),
            "categorical_columns_count": len(categorical_cols),
            "datetime_columns_count": len(datetime_cols),
            "column_summaries": column_summaries,
            "correlations": correlations[:5],
            "outliers": outliers_log,
            "findings": findings
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error performing data analysis: {str(e)}"
        )

@router.post("/{upload_id}/query")
def query_dataset(
    upload_id: int,
    req: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    upload = db.query(Upload).filter(
        Upload.id == upload_id,
        Upload.user_id == current_user.id
    ).first()

    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    if not os.path.exists(upload.filepath):
        raise HTTPException(status_code=404, detail="Physical file not found on server")

    try:
        ext = os.path.splitext(upload.filepath)[1].lower()
        if ext in [".xlsx", ".xls"]:
            df = pd.read_excel(upload.filepath)
        else:
            df = pd.read_csv(upload.filepath)

        question = req.question.strip().lower()
        columns_lower = {col.lower(): col for col in df.columns}
        
        # Rule-based NLP interpreter
        # Pattern 1: average/mean [numeric_col] by/group by [categorical_col]
        match_groupby = re.search(
            r"(?:average|mean|sum|highest|lowest|count)\s+([\w\s\-]+)\s+(?:by|group\s+by)\s+([\w\s\-]+)",
            question
        )
        
        if match_groupby:
            agg_word = re.findall(r"(average|mean|sum|highest|lowest|count)", question)[0]
            col_target_raw = match_groupby.group(1).strip()
            col_group_raw = match_groupby.group(2).strip()
            
            # Match columns
            col_target = None
            col_group = None
            for c_low, c_orig in columns_lower.items():
                if c_low in col_target_raw or col_target_raw in c_low:
                    col_target = c_orig
                if c_low in col_group_raw or col_group_raw in c_low:
                    col_group = c_orig
            
            if col_target and col_group:
                # Perform group aggregation
                if agg_word in ["average", "mean"]:
                    agg_df = df.groupby(col_group)[col_target].mean().reset_index()
                    operation = "average"
                elif agg_word == "sum":
                    agg_df = df.groupby(col_group)[col_target].sum().reset_index()
                    operation = "total"
                elif agg_word in ["highest", "max"]:
                    agg_df = df.groupby(col_group)[col_target].max().reset_index()
                    operation = "maximum"
                elif agg_word in ["lowest", "min"]:
                    agg_df = df.groupby(col_group)[col_target].min().reset_index()
                    operation = "minimum"
                else:
                    agg_df = df.groupby(col_group)[col_target].count().reset_index()
                    operation = "count"

                # Sort for cleaner charts
                agg_df = agg_df.sort_values(by=col_target, ascending=False).head(15)
                
                # Format answers
                top_row = agg_df.iloc[0]
                answer = f"Aggregated {operation} of '{col_target}' grouped by '{col_group}'. The highest group is '{top_row[col_group]}' with a value of {round(top_row[col_target], 2)}."
                
                chart_data = agg_df.to_dict(orient="records")
                return {
                    "answer": answer,
                    "chart_data": chart_data,
                    "x_axis": col_group,
                    "y_axis": col_target,
                    "chart_type": "bar",
                    "status": "Success"
                }

        # Pattern 2: Correlation check
        if "correlation" in question or "relationship" in question:
            matched_cols = []
            for c_low, c_orig in columns_lower.items():
                if c_low in question:
                    matched_cols.append(c_orig)
            
            if len(matched_cols) >= 2:
                # Check if columns are numeric
                c1, c2 = matched_cols[0], matched_cols[1]
                if pd.api.types.is_numeric_dtype(df[c1]) and pd.api.types.is_numeric_dtype(df[c2]):
                    corr_val = df[c1].corr(df[c2])
                    answer = f"The Pearson correlation coefficient between '{c1}' and '{c2}' is {round(corr_val, 4)}."
                    if abs(corr_val) > 0.7:
                        answer += " This indicates a strong linear relationship."
                    elif abs(corr_val) > 0.4:
                        answer += " This indicates a moderate linear relationship."
                    else:
                        answer += " This indicates a weak or no linear relationship."
                    return {
                        "answer": answer,
                        "status": "Success"
                    }
                else:
                    return {
                        "answer": f"Cannot compute correlation because one or both of the selected columns ('{c1}', '{c2}') are not numeric.",
                        "status": "Error"
                    }

        # Pattern 3: General descriptive info
        for c_low, c_orig in columns_lower.items():
            if f"describe {c_low}" in question or f"info {c_low}" in question or f"stats {c_low}" in question or question == c_low:
                col_data = df[c_orig].dropna()
                if pd.api.types.is_numeric_dtype(col_data):
                    desc = col_data.describe().to_dict()
                    answer = (
                        f"Descriptive statistics for numeric column '{c_orig}': \n"
                        f"- Mean: {round(desc['mean'], 2)}\n"
                        f"- Minimum: {round(desc['min'], 2)}\n"
                        f"- Maximum: {round(desc['max'], 2)}\n"
                        f"- Standard Deviation: {round(desc['std'], 2)}\n"
                        f"- Non-null values: {int(desc['count'])}"
                    )
                    # Generate a quick histogram chart data
                    counts, bins = np.histogram(col_data, bins=10)
                    chart_data = [{"bin": f"{round(bins[i], 1)}-{round(bins[i+1], 1)}", "frequency": int(counts[i])} for i in range(len(counts))]
                    return {
                        "answer": answer,
                        "chart_data": chart_data,
                        "x_axis": "bin",
                        "y_axis": "frequency",
                        "chart_type": "bar",
                        "status": "Success"
                    }
                else:
                    mode_val = col_data.mode().iloc[0] if len(col_data) > 0 else "None"
                    unique_cnt = col_data.nunique()
                    answer = (
                        f"Statistics for categorical column '{c_orig}': \n"
                        f"- Unique values: {unique_cnt}\n"
                        f"- Most common value (mode): '{mode_val}'\n"
                        f"- Total populated entries: {len(col_data)}"
                    )
                    # Value counts for top 10 categories
                    vc = col_data.value_counts().head(10).reset_index()
                    vc.columns = [c_orig, "count"]
                    chart_data = vc.to_dict(orient="records")
                    return {
                        "answer": answer,
                        "chart_data": chart_data,
                        "x_axis": c_orig,
                        "y_axis": "count",
                        "chart_type": "pie",
                        "status": "Success"
                    }

        # Fallback response
        numeric_list = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
        categorical_list = [c for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]
        
        answer = (
            f"I parsed your question but couldn't matches a specific aggregate rule. \n"
            f"Here is what I know about this dataset:\n"
            f"- It has {df.shape[0]} rows and {df.shape[1]} columns.\n"
            f"- Numeric columns available: {', '.join(numeric_list[:5])}\n"
            f"- Categorical columns available: {', '.join(categorical_list[:5])}\n\n"
            f"Try asking questions like:\n"
            f"  - 'average [numeric column] by [categorical column]'\n"
            f"  - 'sum [numeric column] by [categorical column]'\n"
            f"  - 'correlation [numeric column 1] and [numeric column 2]'\n"
            f"  - 'describe [column name]'"
        )
        return {
            "answer": answer,
            "status": "Fallback"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {str(e)}"
        )
