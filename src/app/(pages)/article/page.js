export default function Article() {
  return (
    <>
      <div>
        <div>
          <section className="bg-[var(--footer-bg)] text-[var(--footer-text)] text-center py-16 px-4 rounded-b-3xl">
            <h1 className="text-3xl font-bold">
              Welcome to AthletEcho sports community.
            </h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              A platform for aspiring sports writers.
            </p>
          </section>
          <section className="text-center py-16 px-4 h-[600px]">
            <p className="mt-6 text-[var(--text-primary)] max-w-xl mx-auto">
              Over 100 writers have published work with The Sporting Blog and
              more than 3 million people read their work last year.
            </p>
            <button className="mt-6 bg-[var(--primary)] px-6 py-2 rounded-full font-semibold text-sm text-white hover:bg-[var(--primary-hover)] transition-colors">
              Latest Articles
            </button>
          </section>
          <section>
            <div
              className="relative h-screen bg-no-repeat bg-cover bg-center overflow-hidden flex flex-col px-4 lg:pl-9"
              style={{ backgroundImage: "url('/assests/article_image.jpeg')" }}
            >
              <div className="absolute inset-0 flex items-center justify-center ">
                <div className="text-white text-center ">
                  <h2 className="text-5xl font-semibold">
                    The Sporting Blog Podcast
                  </h2>
                  <p className="mt-2 text-lg max-w-md mx-auto ">
                    Interviews, discussions and debates with people involved in
                    sports at every level.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center py-16 px-4 bg-[var(--surface-elevated)]">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">Join our community</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              We will only email you every now and then.
            </p>
            <div className="mt-4 flex justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-mail address"
                className="border border-[var(--border)] px-4 py-2 rounded-full w-full bg-[var(--background)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
              />
              <button className="bg-yellow-400 px-6 py-2 rounded-full font-semibold text-sm text-black hover:bg-yellow-300">
                Sign up
              </button>
            </div>
          </section>
        </div>
      </div>
      ;
    </>
  );
}
