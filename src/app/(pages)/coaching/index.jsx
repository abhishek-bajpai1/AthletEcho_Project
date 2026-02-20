import { motion } from "framer-motion";
import Footer from "../../components/footer";
import Header from "../../components/header";

const esportsCoach = {
  name: "Aryan Singh",
  role: "eSports Coach – CS:GO & GTA RP",
  description:
    "Former professional player and team strategist with 8+ years in competitive gaming. Specializes in tactical gameplay, team communication, and high-stakes tournament prep.",
  tags: ["CS:GO", "GTA RP", "Strategy"],
  image: "/assests/coach-esports.jpg",
};

export default function Coaching() {
  return (
    <>
      <Header />


      <section
        className="relative h-screen bg-no-repeat bg-cover bg-center flex flex-col px-4 lg:pl-9"
        style={{ backgroundImage: "url('/assests/batminton.jpg')" }}
      >
        <div className="flex justify-end p-7 bg-black bg-opacity-40 rounded-xl max-w-md ml-auto">
          <div>
            <h2 className="text-3xl text-white font-bold mb-4">BADMINTON</h2>
            <ul className="list-disc list-inside text-white space-y-2 text-md">
              <li>16 courts spread across two separate halls.</li>
              <li>International standard facility.</li>
              <li>A viewing gallery for 150 people.</li>
              <li>BWF-approved synthetic surface on all courts.</li>
              <li>Equipped to host state, national and international tournaments.</li>
            </ul>
          </div>
        </div>
      </section>


      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-16 px-6 bg-gray-900 text-white max-w-4xl mx-auto rounded-3xl shadow-xl mt-16"
      >
        <h2 className="text-4xl font-extrabold text-center mb-12">
          Meet Our eSports Coach
        </h2>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden max-w-sm mx-auto"
        >
          <img
            src={esportsCoach.image}
            alt={esportsCoach.name}
            className="w-full h-60 object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-1">{esportsCoach.name}</h3>
            <p className="text-green-400 font-semibold mb-3">{esportsCoach.role}</p>
            <p className="text-gray-300 text-sm">{esportsCoach.description}</p>
            <div className="mt-4 flex gap-3 flex-wrap">
              {esportsCoach.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
    </>
  );
}
