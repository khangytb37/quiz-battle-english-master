(function (root) {
  const QUIZ_DATA = [
    {
      id: 1,
      category: "Grammar",
      question: "She ______ to the gym every morning before work.",
      options: ["goes", "go", "going", "is go"],
      answerIndex: 0,
      explanation: "Chủ ngữ 'She' (ngôi thứ 3 số ít) ở thì Hiện tại đơn cần động từ thêm -s/-es. 'goes' là dạng đúng của 'go' với chủ ngữ số ít.",
      timeLimit: 30
    },
    {
      id: 2,
      category: "Grammar",
      question: "If I ______ enough money, I would travel around the world.",
      options: ["have", "had", "has", "having"],
      answerIndex: 1,
      explanation: "Câu điều kiện loại 2 (Second Conditional) diễn tả điều không có thật ở hiện tại: If + S + V(quá khứ đơn), S + would + V(nguyên thể).",
      timeLimit: 30
    },
    {
      id: 3,
      category: "Grammar",
      question: "The project ______ by the time the manager arrives tomorrow.",
      options: ["will have been completed", "will complete", "is completed", "has completed"],
      answerIndex: 0,
      explanation: "'By the time + S + V(hiện tại đơn)' kết hợp với thì Tương lai hoàn thành bị động (will have been + V3/ed) diễn tả hành động hoàn tất trước một mốc tương lai.",
      timeLimit: 30
    },
    {
      id: 4,
      category: "Vocabulary",
      question: "The company decided to ______ the old building and build a new one.",
      options: ["demolish", "establish", "furnish", "accomplish"],
      answerIndex: 0,
      explanation: "'Demolish' nghĩa là phá hủy, đập bỏ (công trình). 'Establish' = thành lập, 'Furnish' = trang bị nội thất, 'Accomplish' = hoàn thành.",
      timeLimit: 30
    },
    {
      id: 5,
      category: "Grammar",
      question: "Not until she ______ home did she realize she had left her phone at the office.",
      options: ["gets", "got", "had got", "getting"],
      answerIndex: 1,
      explanation: "Cấu trúc đảo ngữ 'Not until + S + V(quá khứ đơn) + trợ động từ + S + V'. Mệnh đề chính dùng 'did she realize' nên mệnh đề 'Not until' dùng quá khứ đơn 'got'.",
      timeLimit: 30
    },
    {
      id: 6,
      category: "Phonetics",
      question: "Choose the word whose underlined part is pronounced differently: 'th_ou_gh', 'thr_ou_gh', 'c_ou_gh', 'r_ou_gh'.",
      options: ["though (/oʊ/)", "through (/uː/)", "cough (/ɒ/)", "rough (/ʌ/)"],
      answerIndex: 0,
      explanation: "'Though' đọc là /ðoʊ/ (nguyên âm đôi /oʊ/), khác biệt rõ với nhóm còn lại về âm cuối và cách phát âm 'ou' đặc trưng trong đề thi THPT.",
      timeLimit: 30
    },
    {
      id: 7,
      category: "Phonetics",
      question: "Choose the word that has the stress pattern different from the others:",
      options: ["economic", "photograph", "comfortable", "interesting"],
      answerIndex: 0,
      explanation: "'Economic' /ˌiːkəˈnɒmɪk/ nhấn âm tiết thứ 3 (tính từ tận cùng -ic nhấn âm trước nó). Các từ còn lại đều nhấn âm tiết thứ 1.",
      timeLimit: 30
    },
    {
      id: 8,
      category: "Phonetics",
      question: "Identify the error: 'The number of (A) students who (B) has registered (C) for the course is (D) increasing.'",
      options: ["The number of", "who", "has registered", "is"],
      answerIndex: 2,
      explanation: "Đại từ quan hệ 'who' thay thế cho 'students' (danh từ số nhiều), nên động từ phải chia số nhiều: 'have registered' thay vì 'has registered'.",
      timeLimit: 30
    },
    {
      id: 9,
      category: "Phonetics",
      question: "Identify the error: 'Despite of (A) the heavy rain (B), the football match (C) was not (D) cancelled.'",
      options: ["Despite of", "the heavy rain", "the football match", "was not"],
      answerIndex: 0,
      explanation: "'Despite' không đi kèm giới từ 'of'. Cấu trúc đúng là 'Despite + N/V-ing' hoặc 'In spite of + N/V-ing'.",
      timeLimit: 30
    },
    {
      id: 10,
      category: "Phonetics",
      question: "Choose the word whose '-ed' ending is pronounced differently from the rest:",
      options: ["wanted", "worked", "stopped", "washed"],
      answerIndex: 0,
      explanation: "'Wanted' /ˈwɒntɪd/ phát âm đuôi -ed là /ɪd/ (vì tận cùng bằng âm /t/). 'Worked', 'stopped', 'washed' đều phát âm là /t/.",
      timeLimit: 30
    },
    {
      id: 11,
      category: "Synonym",
      question: "Choose the word CLOSEST in meaning to: 'The government has _implemented_ new policies to reduce pollution.'",
      options: ["carried out", "looked into", "put off", "turned down"],
      answerIndex: 0,
      explanation: "'Implement' = thực thi, triển khai, đồng nghĩa với 'carry out'. 'Look into' = điều tra, 'Put off' = trì hoãn, 'Turn down' = từ chối.",
      timeLimit: 30
    },
    {
      id: 12,
      category: "Synonym",
      question: "Choose the word OPPOSITE in meaning to: 'The teacher gave a _brief_ explanation of the theory.'",
      options: ["lengthy", "short", "clear", "simple"],
      answerIndex: 0,
      explanation: "'Brief' = ngắn gọn, súc tích. Trái nghĩa với 'Lengthy' = dài dòng. 'Short' là đồng nghĩa.",
      timeLimit: 30
    },
    {
      id: 13,
      category: "Synonym",
      question: "Choose the word CLOSEST in meaning to: 'The _inevitable_ result of the experiment surprised no one.'",
      options: ["unavoidable", "unexpected", "unbelievable", "unacceptable"],
      answerIndex: 0,
      explanation: "'Inevitable' = tất yếu, không thể tránh khỏi, đồng nghĩa với 'Unavoidable'.",
      timeLimit: 30
    },
    {
      id: 14,
      category: "Synonym",
      question: "Choose the word OPPOSITE in meaning to: 'She is very _generous_ with her time and money.'",
      options: ["mean", "wealthy", "kind", "careful"],
      answerIndex: 0,
      explanation: "'Generous' = hào phóng. Từ trái nghĩa là 'Mean' = keo kiệt, bủn xỉn.",
      timeLimit: 30
    },
    {
      id: 15,
      category: "Synonym",
      question: "Choose the word CLOSEST in meaning to: 'The professor _acknowledged_ the students' hard work.'",
      options: ["recognized", "ignored", "criticized", "doubted"],
      answerIndex: 0,
      explanation: "'Acknowledge' = công nhận, thừa nhận, đồng nghĩa với 'Recognize'.",
      timeLimit: 30
    },
    {
      id: 16,
      category: "Reading",
      question: "Read: 'Climate change is one of the most pressing issues of our time. Rising temperatures have led to melting ice caps, rising sea levels, and more frequent extreme weather events.' — What is the main idea?",
      options: [
        "Climate change causes many environmental problems",
        "Ice caps are the biggest concern",
        "Weather events are becoming less frequent",
        "Sea levels are not changing"
      ],
      answerIndex: 0,
      explanation: "Đoạn văn liệt kê hàng loạt hệ quả môi trường do biến đổi khí hậu gây ra (tan băng, nước biển dâng, thời tiết cực đoan).",
      timeLimit: 30
    },
    {
      id: 17,
      category: "Reading",
      question: "Fill in the blank: 'Although the weather was terrible, they decided to go ahead ______ the outdoor concert.'",
      options: ["with", "for", "to", "on"],
      answerIndex: 0,
      explanation: "Cụm động từ 'go ahead with something' = tiếp tục tiến hành việc gì đó bất chấp trở ngại.",
      timeLimit: 30
    },
    {
      id: 18,
      category: "Reading",
      question: "Read: 'Studies show that bilingual children develop better problem-solving skills and cognitive flexibility than monolingual peers.' — The word 'peers' is closest in meaning to:",
      options: ["people of the same age group", "teachers", "parents", "researchers"],
      answerIndex: 0,
      explanation: "'Peers' = bạn đồng trang lứa, những người cùng nhóm tuổi hoặc cùng cấp bậc.",
      timeLimit: 30
    },
    {
      id: 19,
      category: "Reading",
      question: "Fill in the blank: 'The more you practice, ______ you will become at speaking English.'",
      options: ["the better", "the best", "better", "good"],
      answerIndex: 0,
      explanation: "Cấu trúc so sánh kép (Double Comparative): 'The + so sánh hơn + S + V, the + so sánh hơn + S + V'.",
      timeLimit: 30
    },
    {
      id: 20,
      category: "Reading",
      question: "Read: 'Remote work has transformed the modern workplace. Employees now have greater flexibility, but they also face challenges such as isolation and difficulty separating work from personal life.' — According to the passage, remote work:",
      options: [
        "has both advantages and disadvantages",
        "is entirely beneficial",
        "only causes isolation",
        "has not changed the workplace"
      ],
      answerIndex: 0,
      explanation: "Đoạn văn nêu rõ cả ưu điểm (greater flexibility) và nhược điểm (isolation, difficulty separating work-life) của làm việc từ xa.",
      timeLimit: 30
    }
  ];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QUIZ_DATA;
  } else {
    root.QUIZ_DATA = QUIZ_DATA;
  }
})(typeof window !== 'undefined' ? window : globalThis);
