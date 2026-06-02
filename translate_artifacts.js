const fs = require('fs');

const hallsData = [
    {
        artifacts: [
            { id: "ramses-colossus", name: "Colossal Ramses II", period: "19th Dynasty", desc: "The centerpiece of the Grand Hall, greeting every visitor with divine authority.", arName: "تمثال رمسيس الثاني الضخم", arPeriod: "الأسرة التاسعة عشرة", arDesc: "القطعة المركزية في البهو العظيم، ترحب بكل زائر بسلطة إلهية." },
            { id: "merneptah-column", name: "Granite Column of Merneptah", period: "19th Dynasty", desc: "A massive monolithic red granite column inscribed with triumphs.", arName: "عمود مرنبتاح الجرانيتي", arPeriod: "الأسرة التاسعة عشرة", arDesc: "عمود ضخم من الجرانيت الأحمر محفور عليه الانتصارات." },
            { id: "ptolemaic-king", name: "Colossus of a Ptolemaic King", period: "Ptolemaic Period", desc: "A monumental statue retrieved from the Mediterranean sea.", arName: "تمثال ضخم لملك بطلمي", arPeriod: "العصر البطلمي", arDesc: "تمثال أثري تم انتشاله من البحر الأبيض المتوسط." },
            { id: "ptolemaic-queen", name: "Colossus of a Ptolemaic Queen", period: "Ptolemaic Period", desc: "A massive statue of a queen depicted in traditional Egyptian style.", arName: "تمثال ضخم لملكة بطلمية", arPeriod: "العصر البطلمي", arDesc: "تمثال ضخم لملكة مصورة على الطراز المصري التقليدي." },
            { id: "victory-stele", name: "Victory Stele of Merneptah", period: "19th Dynasty", desc: "Also known as the Israel Stele, this massive black granite slab commemorates King Merneptah's military victories and contains the earliest known mention of 'Israel'.", arName: "لوحة انتصار مرنبتاح", arPeriod: "الأسرة التاسعة عشرة", arDesc: "تُعرف أيضًا باسم لوحة إسرائيل، وتخلد هذه اللوحة الضخمة المصنوعة من الجرانيت الأسود الانتصارات العسكرية للملك مرنبتاح." },
            { id: "senusret-statue", name: "Statue of Senusret I", period: "12th Dynasty", desc: "A beautifully preserved seated colossus of the great Middle Kingdom pharaoh, showcasing the refined artistic style of the 12th Dynasty.", arName: "تمثال سنوسرت الأول", arPeriod: "الأسرة الثانية عشرة", arDesc: "تمثال جالس محفوظ بشكل جميل لفرعون الدولة الوسطى العظيم، يُظهر الأسلوب الفني الراقي للأسرة الثانية عشرة." }
        ]
    },
    {
        artifacts: [
            { name: "Narmer Palette", period: "Early Dynastic", desc: "A historically vital shield-shaped palette depicting the unification of Upper and Lower Egypt.", arName: "لوحة نارمر", arPeriod: "الأسرات المبكرة", arDesc: "لوحة تاريخية حيوية على شكل درع تصور توحيد مصر العليا والسفلى." },
            { name: "Painted Predynastic Vessel", period: "Naqada II", desc: "A pottery jar beautifully decorated with flamingos and Nile boats.", arName: "وعاء من عصر ما قبل الأسرات", arPeriod: "نقادة الثانية", arDesc: "جرة فخارية مزينة بشكل جميل بطيور النحام وقوارب النيل." },
            { name: "Ritual Flint Knife", period: "Naqada III", desc: "An exceptionally crafted ceremonial knife with an ivory handle.", arName: "سكين صوان طقسي", arPeriod: "نقادة الثالثة", arDesc: "سكين احتفالي مصنوع بشكل استثنائي بمقبض من العاج." },
            { name: "Battlefield Palette", period: "Naqada III", desc: "A ceremonial slate palette depicting lions and battle captives.", arName: "لوحة ساحة المعركة", arPeriod: "نقادة الثالثة", arDesc: "لوحة احتفالية تصور الأسود وأسرى المعركة." },
            { name: "Bull Palette", period: "Naqada III", desc: "A fragment of a ceremonial palette showing a bull trampling a human.", arName: "لوحة الثور", arPeriod: "نقادة الثالثة", arDesc: "جزء من لوحة احتفالية تُظهر ثورًا يدوس إنسانًا." },
            { name: "Hunters Palette", period: "Naqada III", desc: "An intricately carved palette showing warriors hunting wild animals.", arName: "لوحة الصيادين", arPeriod: "نقادة الثالثة", arDesc: "لوحة منحوتة بشكل معقد تظهر محاربين يصطادون الحيوانات البرية." }
        ]
    },
    {
        artifacts: [
            { name: "The Seated Scribe", period: "5th Dynasty", desc: "A remarkably lifelike statue of a scribe with penetrating crystal eyes.", arName: "الكاتب الجالس", arPeriod: "الأسرة الخامسة", arDesc: "تمثال نابض بالحياة لكاتب بعيون كريستالية ثاقبة." },
            { id: "ra-hotep-scribe", name: "The Royal Scribe Ra-Hotep", period: "4th Dynasty", desc: "A masterful stone-carved portrait of one of the Old Kingdom's highest intellectual officials.", arName: "الكاتب الملكي رع حتب", arPeriod: "الأسرة الرابعة", arDesc: "صورة محفورة بالحجر لأحد كبار المسؤولين المثقفين في الدولة القديمة." },
            { name: "Statue of King Khafre", period: "4th Dynasty", desc: "A majestic diorite statue of the builder of the second pyramid of Giza.", arName: "تمثال الملك خفرع", arPeriod: "الأسرة الرابعة", arDesc: "تمثال مهيب من الديوريت لباني الهرم الثاني في الجيزة." },
            { name: "Group Statue of Menkaure", period: "4th Dynasty", desc: "A stunning triad showing King Menkaure flanked by two deities.", arName: "تمثال منكورع", arPeriod: "الأسرة الرابعة", arDesc: "ثلاثي مذهل يُظهر الملك منكورع يحيط به إلهان." },
            { name: "Rahotep and Nofret", period: "4th Dynasty", desc: "Beautifully painted limestone statues of a prince and his wife, retaining their original colors.", arName: "رع حتب ونفرت", arPeriod: "الأسرة الرابعة", arDesc: "تماثيل من الحجر الجيري مطلية بشكل جميل لأمير وزوجته، تحتفظ بألوانها الأصلية." },
            { name: "Kaaper", period: "5th Dynasty", desc: "Also known as Sheikh el-Beled, a highly realistic wooden statue.", arName: "كاعبر (شيخ البلد)", arPeriod: "الأسرة الخامسة", arDesc: "يُعرف أيضًا باسم شيخ البلد، وهو تمثال خشبي واقعي للغاية." },
            { name: "Statue of Djoser", period: "3rd Dynasty", desc: "The oldest known life-size Egyptian statue, depicting the builder of the Step Pyramid.", arName: "تمثال زوسر", arPeriod: "الأسرة الثالثة", arDesc: "أقدم تمثال مصري بالحجم الطبيعي معروف، يصور باني الهرم المدرج." }
        ]
    },
    {
        artifacts: [
            { id: "pyramid-texts", name: "Pyramid Texts Fragment", period: "Old Kingdom", desc: "The oldest known religious texts, carved to guide the king to the afterlife.", arName: "جزء من نصوص الأهرام", arPeriod: "الدولة القديمة", arDesc: "أقدم النصوص الدينية المعروفة، محفورة لإرشاد الملك إلى الحياة الآخرة." },
            { id: "reserve-head", name: "Reserve Head", period: "4th Dynasty", desc: "A mysterious limestone head, likely a substitute for the deceased's real head.", arName: "رأس بديل", arPeriod: "الأسرة الرابعة", arDesc: "رأس غامض من الحجر الجيري، ربما كان بديلاً لرأس المتوفى الحقيقي." },
            { id: "false-door", name: "False Door Stele", period: "Old Kingdom", desc: "A magical portal for the Ka (soul) to receive offerings in the tomb.", arName: "لوحة الباب الوهمي", arPeriod: "الدولة القديمة", arDesc: "بوابة سحرية لكي تتلقى الكا (الروح) القرابين في المقبرة." },
            { id: "hetepheres-bed", name: "Hetepheres I Bed", period: "4th Dynasty", desc: "A reconstructed golden canopy bed belonging to the mother of Khufu.", arName: "سرير حتب حرس الأولى", arPeriod: "الأسرة الرابعة", arDesc: "سرير ذهبي أعيد بناؤه يخص والدة خوفو." },
            { id: "ptah-sokar-osiris", name: "Ptah-Sokar-Osiris figure", period: "Old Kingdom", desc: "A wooden statuette representing the synthesized funerary deity, ensuring protection and rebirth in the afterlife.", arName: "تمثال بتاح-سوكر-أوزوريس", arPeriod: "الدولة القديمة", arDesc: "تمثال خشبي يمثل إله الجنازة المركب، لضمان الحماية والولادة من جديد في الحياة الآخرة." },
            { id: "khufu-ship", name: "Khufu Ship", period: "4th Dynasty", desc: "An intact full-size solar bark from the Giza pyramid complex.", arName: "مركب خوفو", arPeriod: "الأسرة الرابعة", arDesc: "مركب شمسي كامل الحجم وسليم من مجمع أهرامات الجيزة." }
        ]
    },
    {
        artifacts: [
            { id: "senet-board", name: "Senet Game Board", period: "Middle Kingdom", desc: "An ancient board game that held deep religious and recreational significance.", arName: "لوحة لعبة السنت", arPeriod: "الدولة الوسطى", arDesc: "لعبة لوحية قديمة كانت تحمل أهمية دينية وترفيهية عميقة." },
            { id: "meshti-governor", name: "Meshti the Governor", period: "Middle Kingdom", desc: "An exquisite alabaster statue showing the refined bureaucratic status of the Middle Kingdom.", arName: "مشتي الحاكم", arPeriod: "الدولة الوسطى", arDesc: "تمثال رائع من المرمر يوضح المكانة البيروقراطية الرفيعة في الدولة الوسطى." },
            { id: "union-kheper", name: "Union of Kheper-ka-Ra-Seneb", period: "Middle Kingdom", desc: "A rare depiction of high-ranking officials unified in eternal service.", arName: "اتحاد خبر كارع سنب", arPeriod: "الدولة الوسطى", arDesc: "تصوير نادر لكبار المسؤولين المتحدين في الخدمة الأبدية." },
            { id: "sobek-nakht", name: "The Voice of Sobek-Nakht", period: "Middle Kingdom", desc: "A narrative journey into the life of a Middle Kingdom noble.", arName: "صوت سوبك نخت", arPeriod: "الدولة الوسطى", arDesc: "رحلة سردية في حياة أحد نبلاء الدولة الوسطى." },
            { name: "Scribe's Palette", period: "Middle Kingdom", desc: "A wooden palette complete with ink wells and reed brushes used by scribes.", arName: "لوحة الكاتب", arPeriod: "الدولة الوسطى", arDesc: "لوحة خشبية كاملة بمحابر وفرش قصب استخدمها الكتبة." },
            { name: "Cosmetic Palette", period: "Middle Kingdom", desc: "Used for grinding malachite and galena for eye makeup.", arName: "لوحة مستحضرات التجميل", arPeriod: "الدولة الوسطى", arDesc: "تستخدم لطحن الملاكيت والغالينا لمكياج العيون." },
            { name: "Ancient Egyptian Sandals", period: "Middle Kingdom", desc: "Woven papyrus and palm leaf sandals for daily wear.", arName: "صنادل مصرية قديمة", arPeriod: "الدولة الوسطى", arDesc: "صنادل منسوجة من ورق البردي وأوراق النخيل للارتداء اليومي." },
            { name: "Pectoral of Senusret II", period: "12th Dynasty", desc: "A masterpiece of cloisonné jewelry from the Lahun treasure.", arName: "صدرية سنوسرت الثاني", arPeriod: "الأسرة الثانية عشرة", arDesc: "تحفة من مجوهرات المينا المتشابكة من كنز اللاهون." },
            { name: "William the Hippopotamus", period: "12th Dynasty", desc: "A famous faience hippopotamus statuette decorated with marsh flora.", arName: "ويليام فرس النهر", arPeriod: "الأسرة الثانية عشرة", arDesc: "تمثال شهير من الفخار لفرس النهر مزين بنباتات المستنقعات." }
        ]
    },
    {
        artifacts: [
            { name: "Head of Senusret III", period: "12th Dynasty", desc: "Famous for its realistic, somber facial expression portraying the burden of rule.", arName: "رأس سنوسرت الثالث", arPeriod: "الأسرة الثانية عشرة", arDesc: "مشهور بتعبيرات وجهه الواقعية والكئيبة التي تصور عبء الحكم." },
            { name: "Statue of Amenemhat III", period: "12th Dynasty", desc: "A striking statue of the king with prominent cheekbones and heavy eyelids.", arName: "تمثال أمنمحات الثالث", arPeriod: "الأسرة الثانية عشرة", arDesc: "تمثال مذهل للملك بعظام وجنتين بارزة وجفون ثقيلة." },
            { name: "Osiride Pillar of Senusret I", period: "12th Dynasty", desc: "A pillar showing the king in the form of Osiris, the god of the dead.", arName: "عمود أوزيري لسنوسرت الأول", arPeriod: "الأسرة الثانية عشرة", arDesc: "عمود يظهر الملك في هيئة أوزوريس، إله الموتى." },
            { name: "Sphinx of Amenemhat III", period: "12th Dynasty", desc: "A uniquely stylized sphinx featuring a lion's mane instead of the traditional royal headdress.", arName: "أبو الهول لأمنمحات الثالث", arPeriod: "الأسرة الثانية عشرة", arDesc: "تمثال أبو الهول بأسلوب فريد يتميز بلبدة أسد بدلاً من غطاء الرأس الملكي التقليدي." },
            { name: "Block Statue of Senusret-senebefny", period: "12th Dynasty", desc: "An early example of a block statue, providing large surfaces for inscriptions.", arName: "تمثال كتلة لسنوسرت سنبفني", arPeriod: "الأسرة الثانية عشرة", arDesc: "مثال مبكر لتمثال الكتلة، يوفر أسطحًا كبيرة للنقوش." },
            { name: "Mentuhotep II Statue", period: "11th Dynasty", desc: "A painted sandstone statue of the king who reunited Egypt.", arName: "تمثال منتوحتب الثاني", arPeriod: "الأسرة الحادية عشرة", arDesc: "تمثال من الحجر الرملي الملون للملك الذي أعاد توحيد مصر." }
        ]
    },
    {
        artifacts: [
            { id: "ostracon-sketch", name: "Ostracon with a Sketch", period: "New Kingdom", desc: "A piece of limestone used as a sketchpad by an ancient artisan.", arName: "أوستراكا مع رسم", arPeriod: "الدولة الحديثة", arDesc: "قطعة من الحجر الجيري استخدمها حرفي قديم كلوحة رسم." },
            { id: "bakenkhonsu-priest", name: "Priest Bakenkhonsu", period: "19th Dynasty", desc: "The high priest of Amun who served under Ramses the Great.", arName: "الكاهن باكنخونسو", arPeriod: "الأسرة التاسعة عشرة", arDesc: "كبير كهنة آمون الذي خدم في عهد رمسيس الأكبر." },
            { id: "nobleman-chair", name: "Nobleman's Chair", period: "18th Dynasty", desc: "An elegantly crafted wooden chair with ebony and ivory inlays, showing the luxury of the elite.", arName: "كرسي النبيل", arPeriod: "الأسرة الثامنة عشرة", arDesc: "كرسي خشبي مصنوع بأناقة مع تطعيمات من الأبنوس والعاج، يُظهر فخامة النخبة." },
            { id: "floral-collar", name: "Floral Collar", period: "New Kingdom", desc: "A broad collar (Usekh) made of faience beads simulating real flowers.", arName: "ياقة زهرية", arPeriod: "الدولة الحديثة", arDesc: "ياقة عريضة (أوسخ) مصنوعة من خرز الفخار تحاكي الزهور الحقيقية." },
            { id: "sistrum", name: "Sistrum", period: "New Kingdom", desc: "A sacred musical rattle used in religious ceremonies, particularly for Hathor.", arName: "شخشيخة حتحور", arPeriod: "الدولة الحديثة", arDesc: "خشخيشة موسيقية مقدسة تستخدم في الاحتفالات الدينية، وخاصة لحتحور." },
            { id: "shabti-box", name: "Shabti Box", period: "New Kingdom", desc: "A painted wooden box used to store the magical servant figurines, decorated with scenes of the afterlife.", arName: "صندوق الأوشابتي", arPeriod: "الدولة الحديثة", arDesc: "صندوق خشبي ملون يستخدم لتخزين تماثيل الخدم السحرية، مزين بمشاهد الحياة الآخرة." },
            { id: "papyrus-ani", name: "Papyrus of Ani", period: "19th Dynasty", desc: "One of the most beautifully illustrated scrolls of the Book of the Dead, featuring the Weighing of the Heart.", arName: "بردية آني", arPeriod: "الأسرة التاسعة عشرة", arDesc: "واحدة من أجمل لفائف كتاب الموتى المصورة، والتي تتميز بوزن القلب." }
        ]
    },
    {
        artifacts: [
            { id: "thutmose-statue", name: "Statue of Thutmose III", period: "18th Dynasty", desc: "A schist statue of Egypt's greatest military commander.", arName: "تمثال تحتمس الثالث", arPeriod: "الأسرة الثامنة عشرة", arDesc: "تمثال شيست لأعظم قائد عسكري في مصر." },
            { id: "thutmose-triad", name: "Sacred Triad of Thutmose I", period: "18th Dynasty", desc: "A monumental representation of the early New Kingdom's divine authority.", arName: "الثالوث المقدس لتحتمس الأول", arPeriod: "الأسرة الثامنة عشرة", arDesc: "تمثيل ضخم للسلطة الإلهية في أوائل الدولة الحديثة." },
            { id: "kadesh-relief", name: "Relief of the Battle of Kadesh", period: "19th Dynasty", desc: "A deeply carved relief showing Ramses II charging into battle on his chariot.", arName: "نقش معركة قادش", arPeriod: "الأسرة التاسعة عشرة", arDesc: "نقش عميق يظهر رمسيس الثاني يندفع إلى المعركة على عربته." },
            { id: "hatshepsut-sphinx", name: "Seated Sphinx of Hatshepsut", period: "18th Dynasty", desc: "The female pharaoh depicted as a powerful sphinx.", arName: "أبو الهول الجالس لحتشبسوت", arPeriod: "الأسرة الثامنة عشرة", arDesc: "الفرعونة الأنثى مصورة على هيئة تمثال أبو الهول القوي." },
            { id: "memnon-fragment", name: "Colossi of Memnon fragment", period: "18th Dynasty", desc: "A massive piece of quartzite from the statues of Amenhotep III.", arName: "جزء من تمثالي ممنون", arPeriod: "الأسرة الثامنة عشرة", arDesc: "قطعة ضخمة من الكوارتزيت من تماثيل أمنحتب الثالث." },
            { id: "akhenaten-statue", name: "Statue of Akhenaten", period: "18th Dynasty", desc: "A colossal statue from Karnak displaying the radical Amarna art style.", arName: "تمثال أخناتون", arPeriod: "الأسرة الثامنة عشرة", arDesc: "تمثال ضخم من الكرنك يعرض الأسلوب الفني الجذري للعمارنة." },
            { id: "nefertiti-bust", name: "Nefertiti Bust", period: "18th Dynasty", desc: "A stunningly realistic stucco-coated limestone bust of the Great Royal Wife.", arName: "تمثال نصفي لنفرتيتي", arPeriod: "الأسرة الثامنة عشرة", arDesc: "تمثال نصفي واقعي مذهل من الحجر الجيري المطلي بالجص للزوجة الملكية العظيمة." }
        ]
    },
    {
        artifacts: [
            { id: "anubis-guardian", name: "Anubis Guardian Statue", period: "New Kingdom", desc: "A jackal statue of Anubis, the god of embalming, guarding the dead.", arName: "تمثال أنوبيس الحارس", arPeriod: "الدولة الحديثة", arDesc: "تمثال على هيئة ابن آوى لأنوبيس، إله التحنيط، يحرس الموتى." },
            { id: "afterlife-book", name: "Book of the Dead Fragment", period: "New Kingdom", desc: "A papyrus scroll containing spells to navigate the dangers of the underworld.", arName: "جزء من كتاب الموتى", arPeriod: "الدولة الحديثة", arDesc: "لفيفة من ورق البردي تحتوي على تعاويذ للتنقل في مخاطر العالم السفلي." },
            { id: "canopic-jars-afterlife", name: "Canopic Jars", period: "New Kingdom", desc: "Four alabaster jars used to store and protect the mummified organs.", arName: "جرار كانوبية", arPeriod: "الدولة الحديثة", arDesc: "أربعة جرار من المرمر تستخدم لتخزين وحماية الأعضاء المحنطة." },
            { id: "weighing-heart-afterlife", name: "Weighing of the Heart Papyrus", period: "New Kingdom", desc: "An illustration of the ultimate judgment before Osiris.", arName: "بردية وزن القلب", arPeriod: "الدولة الحديثة", arDesc: "تصوير للحكم النهائي أمام أوزوريس." },
            { id: "heart-scarab", name: "Heart Scarab", period: "New Kingdom", desc: "An amulet placed over the heart to prevent it from testifying against the deceased.", arName: "جعران القلب", arPeriod: "الدولة الحديثة", arDesc: "تميمة توضع على القلب لمنعه من الشهادة ضد المتوفى." },
            { id: "mummy-cartonnage", name: "Mummy Cartonnage", period: "New Kingdom", desc: "A painted casing made of layers of linen and plaster to cover the mummy.", arName: "كارتوناج المومياء", arPeriod: "الدولة الحديثة", arDesc: "غلاف مطلي مصنوع من طبقات من الكتان والجص لتغطية المومياء." }
        ]
    },
    {
        artifacts: [
            { id: "tut-mask", name: "Tutankhamun's Mask", period: "18th Dynasty", desc: "The iconic 11kg solid gold death mask inlaid with semi-precious stones.", arName: "قناع توت عنخ آمون", arPeriod: "الأسرة الثامنة عشرة", arDesc: "قناع الموت الأيقوني المصنوع من الذهب الخالص بوزن 11 كجم والمرصع بالأحجار الكريمة." },
            { id: "tut-throne", name: "Golden Throne", period: "18th Dynasty", desc: "A wooden throne covered in gold foil, depicting Tutankhamun and his wife Ankhesenamun.", arName: "العرش الذهبي", arPeriod: "الأسرة الثامنة عشرة", arDesc: "عرش خشبي مغطى برقائق الذهب، يصور توت عنخ آمون وزوجته عنخ إسن آمون." },
            { id: "tut-chariot", name: "Ceremonial Chariot", period: "18th Dynasty", desc: "An ornate ceremonial chariot made from wood and gold leaf.", arName: "العجلة الحربية الاحتفالية", arPeriod: "الأسرة الثامنة عشرة", arDesc: "عجلة احتفالية مزخرفة مصنوعة من الخشب وورق الذهب." },
            { id: "tut-shrine", name: "Golden Shrine", period: "18th Dynasty", desc: "The outermost of four gilded shrines that protected the king's sarcophagus.", arName: "المقصورة الذهبية", arPeriod: "الأسرة الثامنة عشرة", arDesc: "أبعد أربع مقصورات مذهبة حمت تابوت الملك." },
            { id: "anubis-shrine", name: "Anubis Shrine", period: "18th Dynasty", desc: "A jackal figure of Anubis mounted on a portable gilded shrine.", arName: "مقصورة أنوبيس", arPeriod: "الأسرة الثامنة عشرة", arDesc: "تمثال ابن آوى لأنوبيس مركب على مقصورة مذهبة محمولة." },
            { id: "tut-pectoral", name: "Pectoral with Solar Scarab", period: "18th Dynasty", desc: "A complex piece of jewelry symbolizing the sun god's journey.", arName: "صدرية مع جعران شمسي", arPeriod: "الأسرة الثامنة عشرة", arDesc: "قطعة مجوهرات معقدة ترمز إلى رحلة إله الشمس." }
        ]
    },
    {
        artifacts: [
            { id: "seti-sarcophagus", name: "Sarcophagus of Seti I", period: "19th Dynasty", desc: "An alabaster sarcophagus carved with intricate spells from the Book of Gates.", arName: "تابوت سيتي الأول", arPeriod: "الأسرة التاسعة عشرة", arDesc: "تابوت من المرمر منقوش عليه تعاويذ معقدة من كتاب البوابات." },
            { id: "seqenenre-mummy", name: "Mummy of Seqenenre Tao II", period: "17th Dynasty", desc: "The 'Martyr King' whose battle wounds tell the story of the struggle against the Hyksos.", arName: "مومياء سقنن رع تاو الثاني", arPeriod: "الأسرة السابعة عشرة", arDesc: "الملك الشهيد الذي تروي جروح معركته قصة الكفاح ضد الهكسوس." },
            { id: "hatshepsut-mummy", name: "Mummy of Hatshepsut", period: "18th Dynasty", desc: "The remains of the powerful female pharaoh, identified by a missing tooth.", arName: "مومياء حتشبسوت", arPeriod: "الأسرة الثامنة عشرة", arDesc: "بقايا الفرعونة الأنثى القوية، تم التعرف عليها من خلال سن مفقود." },
            { id: "seti-mummy", name: "Mummy of Seti I", period: "19th Dynasty", desc: "One of the most perfectly preserved and noble-looking mummies ever discovered.", arName: "مومياء سيتي الأول", arPeriod: "الأسرة التاسعة عشرة", arDesc: "واحدة من أفضل المومياوات المحفوظة وذات المظهر النبيل التي تم اكتشافها على الإطلاق." },
            { id: "tiye-mummy", name: "Mummy of Queen Tiye", period: "18th Dynasty", desc: "The 'Elder Lady' mummy, famous for her beautifully preserved long hair.", arName: "مومياء الملكة تي", arPeriod: "الأسرة الثامنة عشرة", arDesc: "مومياء السيدة العجوز، الشهيرة بشعرها الطويل المحفوظ بشكل جميل." },
            { id: "merneptah-sarcophagus", name: "Sarcophagus of Merneptah", period: "19th Dynasty", desc: "The outermost granite sarcophagus of Ramses II's successor.", arName: "تابوت مرنبتاح", arPeriod: "الأسرة التاسعة عشرة", arDesc: "التابوت الخارجي من الجرانيت لخليفة رمسيس الثاني." }
        ]
    },
    {
        artifacts: [
            { id: "rosetta-replica-gr", name: "Rosetta Stone Replica", period: "Ptolemaic Period", desc: "The world-famous basalt slab that provided the key to deciphering hieroglyphs.", arName: "نسخة طبق الأصل من حجر رشيد", arPeriod: "العصر البطلمي", arDesc: "لوح البازلت المشهور عالميًا والذي وفر المفتاح لفك رموز الهيروغليفية." },
            { id: "fayum-portrait-gr", name: "Fayum Mummy Portrait", period: "Roman Era", desc: "A remarkably realistic encaustic portrait combining Roman art with Egyptian traditions.", arName: "صورة مومياء الفيوم", arPeriod: "العصر الروماني", arDesc: "صورة شمعية واقعية بشكل ملحوظ تجمع بين الفن الروماني والتقاليد المصرية." },
            { id: "sarapis-statue-gr", name: "Statue of Sarapis", period: "Ptolemaic Period", desc: "A syncretic deity blending Osiris and Apis with Greek gods.", arName: "تمثال سيرابيس", arPeriod: "العصر البطلمي", arDesc: "إله توفيقي يمزج بين أوزوريس وأبيس مع الآلهة اليونانية." },
            { id: "pompeys-pillar", name: "Pompeys Pillar", period: "Roman Era", desc: "A massive Roman triumphal column from Alexandria.", arName: "عمود السواري", arPeriod: "العصر الروماني", arDesc: "عمود نصر روماني ضخم من الإسكندرية." },
            { id: "crocodile-mummy", name: "Crocodile Mummy", period: "Greco-Roman", desc: "A mummified crocodile honoring the god Sobek.", arName: "مومياء تمساح", arPeriod: "العصر اليوناني الروماني", arDesc: "تمساح محنط تكريما للإله سوبك." },
            { id: "roman-emperor-pharaoh", name: "Roman Emperor as Pharaoh", period: "Roman Era", desc: "A statue depicting a Roman ruler in traditional Egyptian pharaonic dress.", arName: "إمبراطور روماني كفرعون", arPeriod: "العصر الروماني", arDesc: "تمثال يصور حاكماً رومانياً في لباس فرعوني مصري تقليدي." }
        ]
    }
];

const en = {};
const ar = {};

hallsData.forEach(hall => {
    hall.artifacts.forEach(art => {
        const artId = art.id || art.name.replace(/\s+/g, '_');
        en['exhibition.artifacts.' + artId + '.name'] = art.name;
        en['exhibition.artifacts.' + artId + '.period'] = art.period;
        en['exhibition.artifacts.' + artId + '.desc'] = art.desc;

        ar['exhibition.artifacts.' + artId + '.name'] = art.arName;
        ar['exhibition.artifacts.' + artId + '.period'] = art.arPeriod;
        ar['exhibition.artifacts.' + artId + '.desc'] = art.arDesc;
    });
});

const enEntries = Object.entries(en).map(([k,v]) => `        "${k}": ${JSON.stringify(v)}`).join(',\n');
const arEntries = Object.entries(ar).map(([k,v]) => `        "${k}": ${JSON.stringify(v)}`).join(',\n');

let langContent = fs.readFileSync('global-lang.js', 'utf8');
langContent = langContent.replace(/(en:\s*\{)/, '$1\n' + enEntries + ',');
langContent = langContent.replace(/(ar:\s*\{)/, '$1\n' + arEntries + ',');
fs.writeFileSync('global-lang.js', langContent);
console.log('Artifacts injected into global-lang.js');

// Now patch script.js to render data-i18n for artifacts
const scriptFile = 'Exhibition-Halls/script.js';
let scriptContent = fs.readFileSync(scriptFile, 'utf8');

scriptContent = scriptContent.replace(
    /<h4 class="artifact-name">\$\{art\.name\}<\/h4>/,
    '<h4 class="artifact-name" data-i18n="exhibition.artifacts.${artId}.name">${typeof window.t === "function" ? window.t("exhibition.artifacts."+artId+".name") || art.name : art.name}</h4>'
);

scriptContent = scriptContent.replace(
    /<p class="artifact-period">\$\{art\.period\}<\/p>/,
    '<p class="artifact-period" data-i18n="exhibition.artifacts.${artId}.period">${typeof window.t === "function" ? window.t("exhibition.artifacts."+artId+".period") || art.period : art.period}</p>'
);

scriptContent = scriptContent.replace(
    /<p class="artifact-desc">\$\{art\.desc\}<\/p>/,
    '<p class="artifact-desc" data-i18n="exhibition.artifacts.${artId}.desc">${typeof window.t === "function" ? window.t("exhibition.artifacts."+artId+".desc") || art.desc : art.desc}</p>'
);

fs.writeFileSync(scriptFile, scriptContent);
console.log('script.js updated with artifact translations');
