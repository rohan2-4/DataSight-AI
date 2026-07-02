function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="text-center max-w-4xl px-6">
                <h1 className="text-6xl font-bold text-blue-600">Datasight AI</h1>
                <p className="text-xl text-gray-600 mt-6">
                    Transfrom your business data into meaningful insights with
                    interactive dashboards and analytics.
                </p>
                <button className="mt-8 bg-blue-600 text-white px-8 rounded-lg hover:bg-blue-700 transition">
                    Get Started
                </button>
            </div>
        </section>
    );
}
export default Hero;