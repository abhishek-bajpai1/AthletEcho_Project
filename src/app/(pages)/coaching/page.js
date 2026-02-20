import Footer from "../../components/footer";
import Header from "../../components/header";

export default function Coaching() {
  const coaches = [
    {
      name: "Ravi Menon",
      sport: "Badminton",
      experience: "10+ years coaching national players.",
      image: "/assests/coach-badminton.jpg",
    },
    {
      name: "Priya Sharma",
      sport: "Cricket",
      experience: "Ex-Ranji player, specializes in youth development.",
      image: "/assests/coach-cricket.jpg",
    },
    {
      name: "Anil Verma",
      sport: "Volleyball",
      experience: "Former national coach with 15 years experience.",
      image: "/assests/coach-volleyball.jpg",
    },
    {
      name: "Aryan Singh",
      sport: "eSports (CS:GO & GTA)",
      experience: "Professional gamer and team strategist with 8+ years in eSports.",
      image: "/assests/coach-esports.jpg",
    },
  ];

  const sections = [
    {
      title: "BADMINTON",
      image: "/assests/batminton.jpg",
      features: [
        "16 courts spread across two separate halls.",
        "International standard facility.",
        "A viewing gallery for 150 people.",
        "BWF-approved synthetic surface on all courts.",
        "Equipped to host state, national and international tournaments.",
      ],
      alignment: "justify-end",
    },
    {
      title: "OUTDOOR CRICKET",
      image: "/assests/cricket.jpg",
      features: [
        "Full-size cricket ground.",
        "10 outdoor pitches with retractable nets.",
        "Nursery ground for children.",
        "Pavilion and analysis room.",
        "A viewing gallery for 100 people.",
      ],
      alignment: "justify-center",
    },
    {
      title: "VOLLEYBALL",
      image: "/assests/volley ball.jpeg",
      features: [
        "8 x 16 metre sand volleyball ground.",
        "Layered with gravel and river sand to replicate beach play.",
        "Ideal for professional and recreational use.",
        "Sand for endurance, strength, speed and agility training.",
      ],
      alignment: "justify-start",
    },
    {
      title: "E-SPORTS ARENA",
      image: "/assests/esports.jpg", // Add a relevant gaming image here
      features: [
        "Dedicated high-end gaming PCs and streaming setups.",
        "Weekly tournaments for CS:GO, Valorant, and GTA RP.",
        "Soundproofed practice rooms and shoutcasting booths.",
        "VR gaming zone with full-body motion tracking.",
        "Professional coaching and team mentoring available.",
      ],
      alignment: "justify-center",
    },
  ];

  return (
    <>
      <Header />

      {/* Sports Facilities */}
      <main className="bg-[var(--surface)]">
        {sections.map((section, idx) => (
          <section
            key={idx}
            className="relative h-screen bg-cover bg-center flex items-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('${section.image}')`,
            }}
          >
            <div className={`p-8 text-white w-full ${section.alignment}`}>
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  {section.features.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}

        {/* Coaches Section */}
        <section className="py-16 px-6 bg-[var(--surface-elevated)]">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--text-primary)]">
            Meet Our Expert Coaches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {coaches.map((coach, i) => (
              <div
                key={i}
                className="bg-[var(--surface)] rounded-2xl shadow-lg overflow-hidden transition hover:shadow-2xl border border-[var(--border)]"
              >
                <img
                  src={coach.image}
                  alt={`${coach.name}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">{coach.name}</h3>
                  <p className="text-[var(--primary)] font-medium">{coach.sport}</p>
                  <p className="text-[var(--text-secondary)] mt-2 text-sm">{coach.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
