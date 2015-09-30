pencilBoxApp.controller('CreateQuizController', ['$scope', '$routeParams', 'CreateQuiz', 'Contents', 'Chapters', 'Subjects',
    function ($scope, $routeParams, CreateQuiz, Contents, Chapters, Subjects) {
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;
        $scope.subjects = Subjects.query({ gradeId : $routeParams.gradeId});
        $scope.chapters = Chapters.query({ subjectId : $routeParams.subjectId, gradeId : $routeParams.gradeId });
        $scope.contents = Contents.query({ chapterId : $routeParams.chapterId, subjectId : $routeParams.subjectId, gradeId : $routeParams.gradeId });

        CreateQuiz.query(function(response) {
            $scope.quizJson = { questions: response.questions }
            $scope.highlightDefault()
        });

        $scope.questionTypes =  [
            {
                "name": "Fill the blanks",
                "id": "1",
                "image": "fill-the-blanks.png",
                "type": "fill-the-blanks"
            },
            {
                "name": "Multiple options",
                "id": "2",
                "image": "multiple-options.png",
                "type": "multiple-options"
            },
            {
                "name": "Match the following",
                "id": "2",
                "image": "match-the-following.png",
                "type": "match-the-following"
            }
        ];

        $scope.showOverlay = function(element) { new Overlay(element); };

        $scope.init = function(mode) { $scope.mode = mode; };

        $scope.highlightDefault = function() {
            $scope.selectedQuestion = 0;
            if($scope.mode === "create" || $scope.quizJson.questions.length === 0) {
                $scope.quizJson = { questions: [] }
                $scope.currentQuestionType = "fill-the-blanks";
                $scope.currentQuestion = $scope.getCurrentQuestionObject();
            } else {
                $scope.currentQuestion = $scope.getCurrentQuestionObject(0);
                $scope.currentQuestionType = $scope.currentQuestion.type;
            }
        }

        $scope.overlayLoaded = function() {
            $scope.showOverlay(document.getElementById("create-quiz-mask"));
        }

        $scope.selectQuestionType = function(type) {
            if($scope.mode === "update") {return;}
            $scope.currentQuestionType = type;
            $scope.currentQuestion = $scope.getCurrentQuestionObject();
        }

        $scope.selectQuestion = function(index) {
            $scope.selectedQuestion = index;
            $scope.currentQuestion = $scope.getCurrentQuestionObject($scope.selectedQuestion);
            $scope.currentQuestionType = $scope.currentQuestion.type;
        }

        $scope.addAnswer = function() { }

        $scope.downloadQuiz = function() { return console.log($scope.currentQuestion); }

        $scope.saveQuiz = function() {
            var isValid = false;
            if($scope.currentQuestionType === "fill-the-blanks") {
                isValid = $scope.validateFIB();
            } else if($scope.currentQuestionType === "multiple-options") {
                isValid = $scope.validateMultipleOption();
            } else if($scope.currentQuestionType === "match-the-following") {
                isValid = $scope.validateMatchTheFollowing();
            }
            if(isValid) {

            }
        }

        $scope.validateFIB = function() { return false; }

        $scope.validateMultipleOption = function() {
            //var result = true, isChecked = true;
            //var textarea = document.querySelector("textarea#question");
            //if(textarea.value.trim().length <= 10) {
            //    textarea.parentElement.classList.add("error");
            //    result = false;
            //} else {
            //    textarea.parentElement.classList.remove("error");
            //}
            //
            //if(document.querySelector(".multiple-options ul.options li input[type='checkbox']:checked") == null) {
            //    result = false;
            //    isChecked = false;
            //}
            //
            //var textboxes = document.querySelectorAll(".multiple-options ul.options li input[type='text']");
            //for(var i= 0, length = textboxes.length; i<length; i++) {
            //    if(!isChecked || textboxes[i].value.trim().length == 0) {
            //        textboxes[i].parentElement.parentElement.classList.add("error");
            //        result = false;
            //    } else {
            //        textboxes[i].parentElement.parentElement.classList.remove("error");
            //    }
            //}
            //
            //return result;
        }

        $scope.validateMatchTheFollowing = function() { return true; }

        $scope.isCurrentSubject = function(subject) { return $scope.current_subject.toLowerCase() === subject.toLowerCase(); }

        $scope.isNotCurrentSubject = function(subject) { return $scope.current_subject.toLowerCase() !== subject.toLowerCase(); };

        $scope.isCurrentChapter = function(chapter) { return $scope.current_chapter.toLowerCase() === chapter.toLowerCase(); };

        $scope.isNotCurrentChapter = function(chapter) { return $scope.current_chapter.toLowerCase() !== chapter.toLowerCase(); };

        $scope.invokeCommand = function(command) { CommandApi.invokeCommand(command); };

        $scope.isApplication = function(type) { return type === "apps"; };

        $scope.isVideo = function(type) { return type === "videos"; };

        $scope.isQuiz = function(type) { return type === "quiz"; };

        $scope.getCurrentQuestionObject = function(index) {
            if(typeof index != "undefined") {
                return $scope.quizJson.questions[index];
            }
            if($scope.currentQuestionType === "fill-the-blanks") {
                return $scope.getFIBQuestion();
            } else if($scope.currentQuestionType === "multiple-options") {
                return $scope.getMultipleOption();
            } else if($scope.currentQuestionType === "match-the-following") {
                return $scope.getMatchTheFollowing();
            }

        }

        $scope.getFIBQuestion = function() {

            return  {
                "type": "fill-the-blanks",
                "id": "1",
                "sentence": "",
                "question": []
            }

        }

        $scope.getMultipleOption = function() {

            return {
                "type": "multiple-options",
                "id": "2",
                "question": "",
                "options": [{"id": 1, "value": ""}, {"id": 2, "value": ""}, {"id": 3, "value": ""}, {"id": 4, "value": ""}],
                "answer": []
            }

        }

        $scope.getMatchTheFollowing = function() {

            return  {
                "type": "fill-the-blanks",
                "id": "1",
                "sentence": "",
                "question": []
            }

        }

        $scope.isChecked = function(checked) {
            console.log(checked, $scope.currentQuestion.options)
        }
    }
]);