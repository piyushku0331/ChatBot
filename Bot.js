const express = require('express');
const app = express();
app.use(express.json());

let id = 2;
const PORT = 3000;

let question = [
    {
        id: 1,
        ques: "What is full form of HBS ?",
        ans: "HBS stands for Handlebars."
    },
    {
        id: 2,
        ques: "What is Node.js ?",
        ans: "Runtime Environment for Javascript."
    }
];

app.get("/bot", function(req, res) {
    if (question.length !== 0) {
        res.status(200).json(question);
    } else {
        res.status(400).json({ message: "Questions not available" });
    }
});

app.get("/bot/:id", function(req, res) {
    let id = parseInt(req.params.id);
    let found = question.find(q => q.id === id);
    if (found) {
        res.status(200).json(found);
    } else {
        res.status(404).json({ message: "Question not found" });
    }
});

app.post("/bot", function(req, res) {
    if (!req.body.ques || !req.body.ans) {
        return res.status(400).json({ message: "Please enter question and answer" });
    }

    id++;
    let newQues = {
        id: id,
        ques: req.body.ques,
        ans: req.body.ans
    };
    question.push(newQues);
    res.status(201).json({ message: "Question and Answer added", data: newQues });
});

app.put("/bot/:id", function(req, res) {
    let id = parseInt(req.params.id);
    let found = question.find(q => q.id === id);

    if (found) {
        found.ques = req.body.ques || found.ques;
        found.ans = req.body.ans || found.ans;
        return res.status(200).json({ message: "Question updated", data: found });
    }

    res.status(404).json({ message: "Question not found" });
});

app.delete("/questions/:id", function(req, res) {
    let id = parseInt(req.params.id);
    const index = question.findIndex(q => q.id === id);

    if (index !== -1) {
        question.splice(index, 1);
        return res.status(200).json({ message: "Question deleted" });
    }

    res.status(404).json({ message: "Question not found" });
});

app.get("/search/:keyword", function(req, res) {
    const keyword = req.params.keyword.toLowerCase();
    const result = question.filter(q =>
        q.ques.toLowerCase().includes(keyword) ||
        q.ans.toLowerCase().includes(keyword)
    );

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: "No matching questions found (case-insensitive)" });
    }
});

app.get("/search-case/:keyword", function(req, res) {
    const keyword = req.params.keyword;
    const result = question.filter(q =>
        q.ques.includes(keyword) ||
        q.ans.includes(keyword)
    );

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: "No matching questions found (case-sensitive)" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});``