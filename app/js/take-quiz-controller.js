pencilBoxApp.controller('TakeQuizController', ['$scope', '$routeParams', 'Contents', 'Chapters', 'Subjects', 'ngDraggable',
    function ($scope, $routeParams, Contents) {
        $scope.current_grade = $routeParams.gradeId;
        $scope.current_subject = $routeParams.subjectId;
        $scope.current_chapter = $routeParams.chapterId;

        $scope.contents = Contents.query({
            chapterId: $routeParams.chapterId,
            subjectId: $routeParams.subjectId, gradeId: $routeParams.gradeId
        }, function() {
            $scope.quizJson = $scope.contents[$routeParams.id];
            $scope.shuffleQuestions();
            $scope.preprocessJson();
            $scope.initQuiz();
        });

        $scope.shuffleQuestions = function() {
            $scope.quizJson.questions = shuffle($scope.quizJson.questions);
            function shuffle(array) {
                var currentIndex = array.length, temporaryValue, randomIndex ;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            }
        }
        $scope.preprocessJson = function() {
            for(var i= 0, length = $scope.quizJson.questions.length; i<length; i++) {
                $scope.quizJson.questions[i].hasAnswered = false;
                if($scope.quizJson.questions[i].type === "fill-the-blanks") {
                    var collection = $scope.quizJson.questions[i].questionCollection;
                    for(var j = 0; j<collection.length; j++) {
                        if(collection[j].type === "answer") {
                            collection[j].value = "";
                        }
                    }
                } else if ($scope.quizJson.questions[i].type === "multiple-options") {
                    var answers = []
                    for(var j = 0; j<$scope.quizJson.questions[i].options.length; j++) {
                        $scope.quizJson.questions[i].options[j].correctAnswer = angular.copy($scope.quizJson.questions[i].options[j].answer);
                        if($scope.quizJson.questions[i].options[j].correctAnswer) {
                            answers.push(true);
                        }
                        $scope.quizJson.questions[i].options[j].answer = false
                    }
                    $scope.quizJson.questions[i].isCheckbox = answers.length > 1 ? true : false;

                    if(!$scope.quizJson.questions[i].isCheckbox) {
                        $scope.quizJson.questions[i].selectedAnswer = -1;
                    }
                } else if($scope.quizJson.questions[i].type === "match-the-following") {
                    var random = $scope.generateRandom($scope.quizJson.questions[i].questions.length);
                    var questions = angular.copy($scope.quizJson.questions[i].questions);
                    for(var j = 0; j<questions.length; j++) {
                        questions[j].answer = $scope.quizJson.questions[i].questions[random[j]].answer;
                        //questions[j].correctAnswer = random[j];
                        questions[j].index = j;
                        questions[j].correctAnswer = $scope.quizJson.questions[i].questions[j].answer;
                    }
                    $scope.quizJson.questions[i].questions = questions;

                }
            }
        }

        $scope.initQuiz = function() {
            if($scope.quizJson.questions.length === 0) {return;}
            $scope.selectQuestion();
        }

        $scope.selectQuestion = function(index) {
            index = typeof index != 'undefined' && index != null ? index : 0;
            $scope.selectedQuestion = index;
            $scope.currentQuestion = $scope.quizJson.questions[$scope.selectedQuestion];
            $scope.currentQuestionType = $scope.currentQuestion.type;
        }

        $scope.navigateQuestion = function(position) {
            var index = $scope.selectedQuestion + position;
            if($scope.quizJson.questions.length > index && 0 <= index) {
                $scope.selectQuestion(index);
            }
        }

        $scope.generateRandom = function(max) {
            var numbers = [];
            for(var i= 0; i<max; i++) {
                numbers.push(i);
            }
            function shuffle(o) {
                for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                return o;
            }
            return shuffle(numbers);
        }

        $scope.hasAnswered = function(type, index) {
            if(type) {
                $scope.setRadioValues(index);
            }

            if($scope.currentQuestion.type === "fill-the-blanks") {
                var collection = $scope.currentQuestion.questionCollection, found = false;
                for(var j = 0; j<collection.length; j++) {
                    if(collection[j].type === "answer" && collection[j].value !== "") {
                        found = true;
                    }
                }
                $scope.currentQuestion.hasAnswered = found;
            } else if ($scope.currentQuestion.type === "multiple-options") {
                var found = false;
                for(var j = 0; j<$scope.currentQuestion.options.length; j++) {
                    if($scope.currentQuestion.options[j].answer === true) {
                        found = true;
                        break;
                    }
                }
                $scope.currentQuestion.hasAnswered = found;
            }
        }

        $scope.setRadioValues = function(index) {
            for(var j = 0; j<$scope.currentQuestion.options.length; j++) {
                $scope.currentQuestion.options[j].answer = false;
                if(index == j) {
                    $scope.currentQuestion.options[j].answer = true;
                }
            }
        }

        $scope.submitQuiz = function() {

        }

        $scope.onDropComplete = function(index, answer) {
            var fromAnswer = $scope.currentQuestion.questions[answer.index].answer;
            var toAnswer = $scope.currentQuestion.questions[index].answer;

            $scope.currentQuestion.questions[answer.index].answer = toAnswer;
            $scope.currentQuestion.questions[index].answer = fromAnswer;
            $scope.currentQuestion.hasAnswered = true;
        }
    }
]);
