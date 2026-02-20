// "use client";
// import { useState } from "react";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { IoHomeOutline } from "react-icons/io5";
// import { FaRegMessage } from "react-icons/fa6";
// import Link from "next/link";
// import { AiOutlineHome } from "react-icons/ai";
// import { GoVideo } from "react-icons/go";
// import { IoMdContacts } from "react-icons/io";
// import { MdOutlineConnectWithoutContact } from "react-icons/md";

// export default function Header() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const closeMenu = () => {
//     setIsOpen(false);
//   };

//   return (
//     <header className="p-3 z-50 bg-amber-200">
//       <nav className="flex justify-between items-center mx-auto py-2 object-contain p-4">
//         {/* Logo */}
//         <Link href="/">
//           <img
//             src="/logo_ath.svg"
//             alt="AtheltEcho Logo"
//             className="sm:h-[100px] lg:h-[100px] w-auto "
//           />
//         </Link>

//         {/* Navigation Links */}
//         <div
//           className={`${
//             isOpen ? "flex" : "hidden"
//           } md:flex md:static fixed inset-0 top-[80px] md:top-0 text-white px-6 py-4 shadow-md md:bg-transparent md:min-h-fit min-h-screen md:w-auto w-full flex-col md:flex-row items-center justify-center md:gap-8 gap-10 z-50 transition-all duration-300`}
//         >
//           <ul className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-black">
//             {[
//               {
//                 name: "Home",
//                 icon: <AiOutlineHome className="text-3xl ml-2" />,
//                 href: "/home",
//               },
//               {
//                 name: "Connection",
//                 icon: (
//                   <MdOutlineConnectWithoutContact className="text-4xl ml-2" />
//                 ),
//                 href: "/connections",
//               },
//               {
//                 name: "Message",
//                 icon: <FaRegMessage className="text-3xl ml-2" />,
//                 href: "/message",
//               },
//               {
//                 name: "Coaching Academy",
//                 icon: <GoVideo className="text-3xl ml-5" />,
//                 href: "/coaching",
//               },
//               {
//                 name: "Contact",
//                 icon: <IoMdContacts className="text-3xl ml-2" />,
//                 href: "/contact",
//               },
//             ].map((link, index) => (
//               <li key={index}>
//                 <Link
//                   href={link.href}
//                   className="flex-col items-center gap-2 py-2 px-3 text-black text-lg hover:text-blue-500 transition duration-200"
//                   onClick={closeMenu}
//                 >
//                   {link.icon && link.icon}

//                   <span>{link.name}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Sign In and Hamburger Menu */}
//         <div className="flex items-center gap-4">
//           <button
//             className="md:hidden text-white"
//             onClick={toggleMenu}
//             aria-label="Toggle navigation menu"
//           >
//             <GiHamburgerMenu className="w-8 h-8" />
//           </button>
//         </div>
//       </nav>
//     </header>
//   );
// }
