interface User {
  id: number;
  fullname: string;
  username: string;
  profileImage: any; // Using any for require() result
}

interface FollowUp {
  id: number;
  user: User;
  createdAt: string;
  place: string;
  reportType: string;
  content: string;
  image?: any[]; // Using any[] for array of require() results
}

interface Feed {
  id: number;
  user: User;
  createdAt: string;
  place: string;
  reportType: string;
  content: string;
  image?: any[]; // Using any[] for array of require() results
  numOfLike?: number;
  numberOfView?: number;
  followUp?: FollowUp | FollowUp[];
}

const feeds: Feed[] = [
  {
    id: 123,
    user: {
      id: 234,
      fullname: "Okon Sarah",
      username: "Vk_Okon",
      profileImage: require("@/assets/dummyprofile/dummyprofile_1.jpg"),
    },
    createdAt: "2days ago",
    place: "Lagos - Ikeja",
    reportType: "Fake Product",
    content:
      "In bustling Ikeja, Lagos, a troubling trend has emerged: the proliferation of counterfeit packaged provisions. Consumers navigating the markets",
    image: [require("@/assets/images/citizenx.png")], // TODO: Replace with actual report image
    numOfLike: 110,
    numberOfView: 220,
    followUp: [
      {
        id: 450,
        user: {
          id: 345,
          fullname: "Micheal Obi",
          username: "Obi_1",
          profileImage: require("@/assets/dummyprofile/dummyprofile_18.jpg"),
        },
        createdAt: "3days ago",
        place: "Lagos - Ikeja",
        reportType: "Fake Product",
        content:
          "With concerns mounting over the prevalence of these fraudulent goods, residents are calling on NAFDAC to intervene swiftly and rigorously investigate the matter.",
        image: [
          require("../assets/images/citizenx.png"),
          require("../assets/images/citizenx.png"),
          require("../assets/images/citizenx.png"),
        ],
      },
    ],
  },

  {
    id: 234,
    user: {
      id: 345,
      fullname: "faruk yahaya",
      username: "faruk234",
      profileImage: require("@/assets/dummyprofile/dummyprofile_2.jpg"),
    },
    createdAt: "1 week ago",
    place: "Abuja - kuje",
    reportType: "Roads",
    content:
      "Most federal roads in the country are presently in a state of disrepair, occasioning tales of woe by road users in the affected places. Indeed, findings following onsite inspection and assessment of federal roads in different parts of the country by our correspondents clearly contradict claims of achievements by the administration on road infrastructure.  ON Wednesday, October 19, 2022, the Minister of Works and Housing, Mr. Babatunde Fashola, had at a press conference to highlight the achievements of the Buhari administration in the areas of Works and Housing, boasted that despite the shortfall in federal revenue arising from a depressed economy and drop in oil revenue, the Federal Government has been able to construct and complete at least 8,352.94 kilometres of roads and created no fewer than 339,955 jobs between 2016 and 2022.The minister did not stop there. He also claimed that 12 major federal roads spanning 896.187 kilometres in the country within the same period had been rehabilitated, with attendant reduction of travel time by 56.20 percent and added value to the people in the communities where the roads pass through. The Minister was to reiterate these claims on Tuesday November 1, 2022 while defending the 2023 budget proposal of his ministry at the House of Representatives. At the event, Fashola informed that the ministry was undertaking a total of 1,642 highway contracts nationwide at a total contract sum of N10,395,294,937,624.20. He said that these projects had special funding mechanisms which included the Presidential Infrastructure Development Fund, PIDF, SUKUK and Nigerian National Petroleum Company Limited, NNPCL.",
    image: [require("../assets/images/citizenx.png")], // TODO: Replace with actual road image
    numOfLike: 210,
    numberOfView: 20,
    followUp: [
      {
        id: 560,
        user: {
          id: 123,
          fullname: "Eneh John",
          username: "Vk_Eneh",
          profileImage: require("@/assets/dummyprofile/dummyprofile_22.jpg"),
        },
        createdAt: "3days ago",
        place: "Abuja - kuje",
        reportType: "Roads",
        content:
          "Recall that the minister had in November last year made similar claims when he appeared before the House of Representatives Committee on Works to defend the 2022 budget proposal in Abuja. At the event, he said his ministry had about 13,000km of roads and bridges under construction and rehabilitation in 856 contracts, comprising 795 projects and aggregate length of 816.29km of roads and 733.2m of bridges.",
        image: [
          require("../assets/images/citizenx.png"),
          require("../assets/images/citizenx.png"),
          require("../assets/images/citizenx.png"),
        ], // TODO: Replace with actual road images
      },
    ],
  },

  {
    id: 345,
    user: {
      id: 456,
      fullname: "Daniel duke",
      username: "Duke_Of_nigeria",
      profileImage: require("@/assets/dummyprofile/dummyprofile_4.jpg"),
    },
    createdAt: "1 week ago",
    place: "River State - Port Hercourt",
    reportType: "election",
    content:
      "The sun has stopped to shine on the household of a chartered surveyor and former Caretaker Chairman of the ruling All Progressives Congress in Ward 10, Ahoada West, Rivers State, Chief Chiosom Lennard. Lennard’s life was cut short by gunmen, who abducted and killed him in cold blood on March 18, 2023, the day Nigeria held its governorship and House of Assembly elections.Lennard was counting down to his next birthday on April 23 when he was killed. His PhD defence at the Rivers State University, Port Harcourt, according to one of his close associates, Mr Frankie Code, was scheduled for Thursday, March 23.",
    image: [
      require("../assets/images/citizenx.png"),
      require("../assets/images/citizenx.png"),
    ], // TODO: Replace with actual election images
    numOfLike: 110,
    numberOfView: 220,
    followUp: {
      id: 608,
      user: {
        id: 510,
        fullname: "tasha wike",
        username: "pretty_Tasha",
        profileImage: require("@/assets/dummyprofile/dummyprofile_6.jpg"),
      },
      createdAt: "3days ago",
      place: "River State - Port Hercourt",
      reportType: "election",
      content:
        "He was gruesomely murdered for struggling with hoodlums who stormed his polling unit to disrupt the poll by snatching the ballot boxes.His wife just gave birth. The child is only 21 days old. She is still in shock at how a man she saw that morning was brought back, wrapped in bloodied wrappers for simply going out to exercise his right to vote.",
      image: [require("../assets/images/citizenx.png")], // TODO: Replace with actual electoral image
    },
  },

  {
    id: 5681,
    user: {
      id: 6890,
      fullname: "Dapo Karim",
      username: "GenX_Aliko",
      profileImage: require("@/assets/dummyprofile/dummyprofile_9.jpg"),
    },
    createdAt: "2 days ago",
    place: "Abuja - Municipal",
    reportType: "Crime",
    content:
      "Some Nigerians have expressed outrage over the closure of the popular Banex Plaza in Abuja, saying the action of the military was indecent.The Nigerians stated their views through various social media posts since the plaza was shut down some three days ago.",
    image: [
      require("../assets/images/citizenx.png"),
      require("../assets/images/citizenx.png"),
    ], // TODO: Replace with actual mob attack images
    numOfLike: 310,
    numberOfView: 520,
    followUp: [
      {
        id: 60810,
        user: {
          id: 51011,
          fullname: "Opeyemi Ekunoda",
          username: "JamesStar123",
          profileImage: require("@/assets/dummyprofile/dummyprofile_8.jpg"),
        },
        createdAt: "3days ago",
        place: "Abuja - Municipal",
        reportType: "Crime",
        content:
          "In response to this incident, a high-level meeting was convened in the Office of the National Security Adviser including  the Principal General Staff Officer to the NSA, Commissioner of Police FCT, the FCT Director of the Department of State Services, the Leadership and Management of Banex Plaza, a Representative from the Directorate of Abuja Environmental Protection Board, and the National Chairman of the Mobile Phone Traders Association. The primary objective of this meeting was to identify and apprehend the perpetrators and ensure the continued security of the Federal Capital Territory. The following resolutions were agreed upon: a. Immediate reopening of Banex Plaza: Banex Plaza will be reopened immediately to the public. b. Closure of Shop C93: The leadership of Banex Plaza is instructed to lock up Shop C93 with immediate effect.  c. Arrest of Perpetrators: The owners of the shop who orchestrated the mob attack on the soldiers are to be arrested and handed over to the Nigerian Police. d. Vigilance by Market Leaders: Market leaders are to remain vigilant and report any remaining perpetrators to the authorities.",
        image: [require("@/assets/reportImage/mobAttack.jpg")],
      },
      {
        id: 60821,
        user: {
          id: 51089,
          fullname: "Alihu Shagari",
          username: "Gen_Shagari",
          profileImage: require("@/assets/dummyprofile/dummyprofile_18.jpg"),
        },
        createdAt: "3days ago",
        place: "Abuja - Municipal",
        reportType: "Crime",
        content:
          "The Nigerian Army will also thoroughly investigate the circumstances surrounding the presence of its personnel at the plaza and the subsequent attack. It must be reiterated that acts of violence against military personnel are not only condemnable but also pose a significant threat to national security and public order.",
      },
    ],
  },

  {
    id: 568110,
    user: {
      id: 689090,
      fullname: "Oluwakomiyo Angel",
      username: "guardianAngel",
      profileImage: require("@/assets/dummyprofile/dummyprofile_5.jpg"),
    },
    createdAt: "1 week ago",
    place: "Ondo - Akure",
    reportType: "Crime",
    content:
      "Last Easter Monday, when Christians all over the world were celebrating Jesus Christ, an Uber driver, Tope Olorunfemi, was begging for his life in the Ijoka area of Akure, Ondo State. A bloodthirsty horde milled around him, hitting him with stones and sticks, as they accused him of being an Internet fraudster, aka Yahoo boy. By his side was his mother, Mojisola, who appealed to the mob to let go of her son, who was only visiting the town because his wife and child were holidaying with her. Instead of heeding the pleas, the mob made to burn her with her son. Recalling the heart-rending incident in tears, the bereaved mother said, “By the time I got there, he was in a pool of blood; his face was on the ground. I called his name; he raised his head and looked at my face. I asked his siblings to help me carry him to a hospital; the people there said they would hit me with sticks. I was hit and they said I must not carry him. That was how someone from the crowd poured petrol on him and lit a cloth and threw it at him. I ran there and picked the cloth up and threw it away. Someone said they should hit me with sticks again; they said, Who is this woman? I said he was my son and begged them to help me carry him. Someone threw the burning cloth at him again, but he took the cloth and threw it away himself because it was already burning him. As he threw the cloth away, there was one tall man, his name is Luku; Luku is a friend to Tope’s elder brother. Tope’s elder brother shouted at Luku that Tope was his younger brother, but Luku pushed him away; he carried a stick and hit Tope’s head in my presence.",
    image: [
      require("../assets/images/citizenx.png"),
      require("../assets/images/citizenx.png"),
    ], // TODO: Replace with actual mob attack images
    numOfLike: 110,
    numberOfView: 220,
    followUp: [
      {
        id: 60810,
        user: {
          id: 51011,
          fullname: "Opeyemi James",
          username: "JamesStar123",
          profileImage: require("@/assets/dummyprofile/dummyprofile_8.jpg"),
        },
        createdAt: "3days ago",
        place: "Ondo - Akure",
        reportType: "Crime",
        content:
          "The Ondo State Police Command on Monday said it had arrested no fewer than seven persons in connection with the killing of a man, Tope Olorunfemi, who was lynched in Akure, the state capital.",
        image: [require("../assets/images/citizenx.png")], // TODO: Replace with actual mob attack image
      },
      {
        id: 60821,
        user: {
          id: 51089,
          fullname: "Dapo Karim",
          username: "Aliko_Of_our_generation",
          profileImage: require("@/assets/dummyprofile/dummyprofile_9.jpg"),
        },
        createdAt: "3days ago",
        place: "Ondo - Akure",
        reportType: "Crime",
        content:
          "The PPRO said, “Last week Monday, we had a case of jungle justice in Akure in which a young man who was driving along Ijoka road had an accident and unfortunately killed one commercial motorcyclist and injured six others. Unfortunately those who were around ought to have helped resolve jungle justice. Some of these people have been arrested. Seven people put together are in custody but four principal suspects are here. Jungle justice is illegal, it’s against the law.",
      },
    ],
  },
  {
    id: 568110457,
    user: {
      id: 68909098,
      fullname: "Ginika Mba",
      username: "FirstLady12",
      profileImage: require("@/assets/dummyprofile/dummyprofile_16.jpg"),
    },
    createdAt: "1 week ago",
    place: "Jigawa - Dutsa",
    reportType: "Corruption",
    content:
      "FRN vs Olatunji Oyeyemi Moronfoye (Former Kwara State Commissioner for Information)   5-count charge bordering on abuse of office, diversion of public funds and money laundering. to the sum of N371,990,000 The first Defendant was alongside his accomplice arraigned for allegedly awarding contracts for the renovation of Ijagbo Primary Health Centre and Specialist Hospitals within the State to a company in which he has interest and was the sole signatory to its account; and for procuring 13 Hiace buses from a Local Car Dealer and converted same to ambulance in place of a factory built ambulance.",
    image: [],
    numOfLike: 110,
    numberOfView: 220,
    followUp: [],
  },
  {
    id: 568110222,
    user: {
      id: 689090909,
      fullname: "Gloria Duru",
      username: "Black_LadyGaga",
      profileImage: require("@/assets/dummyprofile/dummyprofile_14.jpg"),
    },
    createdAt: "1 week ago",
    place: "Anambra - Awka",
    reportType: "Corruption",
    content:
      "FRN vs Emeka Edem  2-count charge of conspiracy and illegal dealing in petroleum product. The Accused was alleged to have illegally loaded 30 drums of petroleum products confirmed to be crude oil on a Mercedes Benz Truck, with registration number Ebonyi XA 327 CHR, without a proper license. The Defendant was convicted and sentenced to two years imprisonment. The sentence came with an option of fine of Two Hundred Thousand Naira (N200, 000, 00) on each count. Also, a Mercedes Benz Truck, loaded with 30 drums of products confirmed to be crude oil, used by the convict to commit the crime, was forfeited to the Federal Government.",
    image: [],
    followUp: [],
  },
  {
    id: 5681909097789,
    user: {
      id: 6890909767,
      fullname: "Miriam Dantata",
      username: "Queen_Miri",
      profileImage: require("@/assets/dummyprofile/dummyprofile_19.jpg"),
    },
    createdAt: "2 days ago",
    place: "Kano - Kano",
    reportType: "Others",
    content:
      "The Federal High Court in Kano, presided over by Justice S. A. Amobeda, issued an order for the eviction of Emir Muhammadu Sanusi II from the Kofar Kudu Palace, reinforcing the authority of the 15th Emir of Kano, Aminu Ado Bayero.  An order of interim injunction restraining the respondents from inviting, arresting, detaining, threatening, intimidating, harassing the Applicant, or infringing on his rights is hereby granted,  stated Justice Amobeda",
    image: [
      require("../assets/images/citizenx.png"),
      require("../assets/images/citizenx.png"),
    ], // TODO: Replace with actual report case images
    numOfLike: 310,
    numberOfView: 520,
    followUp: [
      {
        id: 608105555555,
        user: {
          id: 510112343556,
          fullname: "Amina Mohammed",
          username: "Amina234",
          profileImage: require("@/assets/dummyprofile/dummyprofile_10.jpg"),
        },
        createdAt: "3days ago",
        place: "Kano - Kano",
        reportType: "Others",
        content:
          "On the other hand, the Kano State High Court, under the jurisdiction of Hon. Justice Amina Adamu Aliyu, issued an injunction to protect Muhammadu Sunusi and other key figures from potential harassment by state authorities. This order prevents any interference with the Emir’s autonomy and the seizure of key symbols of his authority, such as the twin spear, the Royal Hat of Dabo, and the Ostrich-feathered shoes.",
        image: [require("../assets/images/citizenx.png")], // TODO: Replace with actual report case image
      },
      {
        id: 6082109098711,
        user: {
          id: 51089111111,
          fullname: "Aaliyah Muhammed",
          username: "empress_liya",
          profileImage: require("@/assets/dummyprofile/dummyprofile_18.jpg"),
        },
        createdAt: "3days ago",
        place: "Kano - Kano",
        reportType: "Others",
        content:
          "The Kano High Court sitting on Miller Road has stopped the police, the State Security Service (SSS) and Nigerian military from evicting the Emir of Kano, Muhammadu Sanusi II, who was recently reinstated.  Granting the order, Justice Amina Adamu Aliyu of the Kano High Court also restrained the security agencies from arresting or harassing the emir and his kingmakers.",
      },
    ],
  },
];
