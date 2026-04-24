export const hallsData = [
  {
      id: 'tutankhamun',
      name: 'Tutankhamun Galleries',
      era: 'New Kingdom',
      shortDesc: 'The complete collection of the Boy King, spanning over 5,000 artifacts from his undisturbed tomb.',
      longDesc: 'The Tutankhamun Galleries at the Grand Egyptian Museum showcase the entirety of the treasures found in the tomb of the boy-king in 1922. This collection, arguably the most important archaeological find in history, includes his iconic gold mask, chariots, and everyday objects that reveal the opulence of the 18th Dynasty.',
      image: '/src/assets/images/tut.png', 
      artifacts: [
          {
              name: "Tutankhamun's Mask",
              period: "18th Dynasty",
              desc: "The iconic funerary mask made of solid gold and inlaid with semi-precious stones.",
              image: "/src/assets/images/tut.png"
          },
          {
              name: "Golden Throne",
              period: "18th Dynasty",
              desc: "A wooden throne covered in gold leaf, featuring a scene of the king and his queen.",
              image: "/src/assets/images/golden_throne.png"
          },
          {
              name: "Ceremonial Chariot",
              period: "18th Dynasty",
              desc: "One of the highly decorated chariots used by the Pharaoh during state ceremonies.",
              image: "/src/assets/images/ceremonial_chariot.png"
          }
      ]
  },
  {
      id: 'grand-hall',
      name: 'Grand Hall',
      era: 'New Kingdom',
      shortDesc: 'Stand beneath the towering presence of Ramses II in this colossal architectural masterpiece.',
      longDesc: 'The Grand Hall is the majestic entrance to the GEM, dominated by the 82-ton, 11-meter-high statue of King Ramses II. This hall serves as a gateway to the museum’s chronological journey, surrounded by colossal architectural elements from various dynasties.',
      image: '/src/assets/images/grand.png',
      artifacts: [
          {
              name: "Colossal Ramses II",
              period: "19th Dynasty",
              desc: "The centerpiece of the Grand Hall, greeting every visitor with divine authority.",
              image: "/src/assets/images/grand.png"
          },
          {
              name: "Granite Column of Merneptah",
              period: "19th Dynasty",
              desc: "A massive monolithic red granite column inscribed with the triumphs of King Merneptah.",
              image: "/src/assets/images/column_merneptah.png"
          },
          {
              name: "Colossus of a Ptolemaic King",
              period: "Ptolemaic Period",
              desc: "A massive red granite statue of a Ptolemaic ruler, showcasing the unique Greco-Egyptian artistic style.",
              image: "/src/assets/images/ptolemaic_king.png"
          },
          {
              name: "Colossus of a Ptolemaic Queen",
              period: "Ptolemaic Period",
              desc: "A majestic companion statue representing a Ptolemaic queen, carved in high-detail dark granite.",
              image: "/src/assets/images/ptolemaic_queen.png"
          }
      ]
  },
  {
      id: 'royal-mummies',
      name: 'Royal Mummies Hall',
      era: 'New Kingdom',
      shortDesc: 'A silent tribute to the greatest rulers of the New Kingdom in a uniquely climate-controlled sanctuary.',
      longDesc: 'Designed to mimic the Valley of the Kings, this hall provides a solemn and reverent space for the remains of Egypt’s most powerful rulers. While the famous royal mummies reside at the NMEC, this hall showcases their magnificent sarcophagi, canopic chests, and the funerary equipment that accompanied them to eternity.',
      image: '/src/assets/images/mummy.png',
      artifacts: [
          {
              name: "Sarcophagus of Seti I",
              period: "19th Dynasty",
              desc: "An exquisitely carved alabaster sarcophagus with translucent scenes from the Book of Gates.",
              image: "/src/assets/images/sarcophagus_seti.png"
          },
          {
              name: "Canopic Chest of Queen Hetepheres",
              period: "4th Dynasty",
              desc: "A rare calcite chest used to preserve the internal organs of the queen, featuring intricate hieroglyphs.",
              image: "/src/assets/images/canopic_chest_hetepheres.png"
          },
          {
              name: "Golden Mask of Psusennes I",
              period: "21st Dynasty",
              desc: "A stunning solid gold funerary mask, often called the 'Silver Pharaoh's treasure,' showcasing exquisite craftsmanship.",
              image: "/src/assets/images/mask_psusennes.png"
          }
      ]
  },
  {
      id: 'daily-life',
      name: 'Daily Life Hall',
      era: 'Middle Kingdom',
      shortDesc: 'Uncover the intimate world of ancient Egyptians through their jewelry, tools, and personal belongings.',
      longDesc: 'Beyond the grandeur of kings, this gallery explores the lives of average Egyptians—farmers, scribes, and artisans. It displays pottery, makeup kits, medical tools, and toys, illustrating a civilization vibrant with human activity.',
      image: '/src/assets/images/daily.png',
      artifacts: [
          {
              name: "Senet Game Board",
              period: "New Kingdom",
              desc: "The most popular board game of ancient Egypt, symbolizing the passage of the soul into the afterlife.",
              image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4158?q=80&w=2064&auto=format&fit=crop"
          },
          {
              name: "Scribe's Palette and Pens",
              period: "Middle Kingdom",
              desc: "A wooden palette with ink wells for red and black ink, used by the highly respected class of Egyptian scribes.",
              image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
          },
          {
              name: "Cosmetic Palette",
              period: "Predynastic",
              desc: "Used for grinding pigments for eye paint, a staple of Egyptian beauty culture and ritual.",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
          },
          {
              name: "Ancient Egyptian Sandals",
              period: "New Kingdom",
              desc: "Remarkably preserved sandals woven from papyrus and palm leaves, worn by both elites and commoners.",
              image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
          }
      ]
  },
  {
      id: 'sculpture',
      name: 'Sculpture & Statues Hall',
      era: 'Old Kingdom',
      shortDesc: 'A procession of stone giants representing three thousand years of artistic perfection.',
      longDesc: 'This hall chronologically displays the development of Egyptian sculpture. From the rigid poses of the Old Kingdom to the naturalism of the Amarna period, it houses masterpieces in limestone, basalt, and granite.',
      image: '/src/assets/images/sculpture.png',
      artifacts: [
          {
              name: "The Seated Scribe",
              period: "5th Dynasty",
              desc: "A highly realistic limestone statue of a scribe in a traditional cross-legged position, capturing a moment of intense focus.",
              image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
          },
          {
              name: "Statue of King Khafre",
              period: "4th Dynasty",
              desc: "A majestic diorite statue of the pyramid builder, protected by the wings of the falcon god Horus.",
              image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
          },
          {
              name: "Group Statue of Menkaure",
              period: "4th Dynasty",
              desc: "A masterpiece of Egyptian sculpture showing the king accompanied by the goddess Hathor and a local deity.",
              image: "https://images.unsplash.com/photo-1626084300762-5f72382e379a?q=80&w=2069&auto=format&fit=crop"
          },
          {
              name: "Bust of Nefertiti (Replica)",
              period: "Amarna Period",
              desc: "A stunning representation of the Great Royal Wife of Akhenaten, showcasing the unique realism of the era.",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
          }
      ]
  },
  {
      id: 'predynastic',
      name: 'Pre-Dynastic Period Hall',
      era: 'Old Kingdom',
      shortDesc: 'The dawn of civilization. Explore the origins of the state and the first hieroglyphic writings.',
      longDesc: 'This gallery focuses on the Neolithic and Pre-dynastic cultures (Naqada I-III) that laid the foundation for Pharonic civilization. It features early pottery, flint tools, and the evolution of symbolic representation.',
      image: '/src/assets/images/predynastic.png',
      artifacts: [
          {
              name: "Narmer Palette (Replica)",
              period: "Protodynastic",
              desc: "A significant archaeological find containing some of the earliest hieroglyphic inscriptions, depicting the unification of Egypt.",
              image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
          },
          {
              name: "Painted Predynastic Vessel",
              period: "Naqada II",
              desc: "Red-on-buff pottery decorated with images of boats, animals, and hunting scenes, predating the unification.",
              image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4158?q=80&w=2064&auto=format&fit=crop"
          },
          {
              name: "Ritual Flint Knife",
              period: "Predynastic",
              desc: "An expertly crafted flint knife with an intricately carved ivory handle, demonstrating early artistic mastery.",
              image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
          }
      ]
  },
  {
      id: 'afterlife',
      name: 'Beliefs in the Afterlife',
      era: 'New Kingdom',
      shortDesc: 'Journey to the West. Discover the rituals, mummification, and the magic of the afterlife.',
      longDesc: 'Funerary customs were central to ancient Egyptian life. This hall explores mummification, the weighing of the heart ceremony, and the items buried with the deceased to ensure eternal life in the Field of Reeds.',
      image: '/src/assets/images/afterlife.png',
      artifacts: [
          {
              name: "Anubis Guardian Statue",
              period: "New Kingdom",
              desc: "A life-sized statue of the jackal god Anubis, originally placed at the entrance of the burial chamber to guard the deceased.",
              image: "https://images.unsplash.com/photo-1626084300762-5f72382e379a?q=80&w=2069&auto=format&fit=crop"
          },
          {
              name: "Book of the Dead Fragment",
              period: "New Kingdom",
              desc: "A papyrus scroll containing protective spells and rituals intended to guide the deceased through the underworld.",
              image: "https://images.unsplash.com/photo-1618172193622-ae2d025f4158?q=80&w=2064&auto=format&fit=crop"
          },
          {
              name: "Shabti Figures of Tutankhamun",
              period: "18th Dynasty",
              desc: "Small turquoise blue figurines intended to perform manual labor for the king in the afterlife.",
              image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5947?q=80&w=2069&auto=format&fit=crop"
          }
      ]
  },
  {
      id: 'grecoroman',
      name: 'Greco-Roman Period Hall',
      era: 'Late Period',
      shortDesc: 'The fusion of worlds. Witness the cultural blend of ancient Egypt with Greek and Roman influences.',
      longDesc: 'After Alexander the Great’s conquest, Egypt became a crossroads of cultures. This gallery shows the fascinating hybrid art, where Pharaohs were depicted in Greek styles and Roman emperors adopted Egyptian titles.',
      image: '/src/assets/images/grecoroman.png',
      artifacts: [
          {
              name: "Rosetta Stone (Replica)",
              period: "Ptolemaic Period",
              desc: "The world-famous basalt slab that provided the key to deciphering ancient Egyptian hieroglyphs.",
              image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2070&auto=format&fit=crop"
          },
          {
              name: "Fayum Mummy Portrait",
              period: "Roman Era",
              desc: "A remarkably realistic encaustic portrait of a young individual, combining Roman artistic style with Egyptian burial traditions.",
              image: "https://images.unsplash.com/photo-1626084300762-5f72382e379a?q=80&w=2069&auto=format&fit=crop"
          },
          {
              name: "Statue of Sarapis",
              period: "Ptolemaic Era",
              desc: "A monumental representation of the god Sarapis, a deity created to unify Greek and Egyptian worshippers.",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000&auto=format&fit=crop"
          }
      ]
  }
];
