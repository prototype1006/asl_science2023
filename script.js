// More API functions here:
        // https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

        // the link to your model provided by Teachable Machine export panel
        const URL = "./mymodel/";
        const handSymbols = {
		A: "A"
		B: "B"
		C: "C"
		D: "D"
		E: "E"
		Nothing: "Nothing there, or not recognized"

        }
        let model, webcam, labelContainer, maxPredictions, statusDiv;

        // Load the image model and setup the webcam
        async function init() {
            document.getElementById("startBtn").style.display = 'none';
            document.getElementById("loadingMsg").style.display = 'block';

            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            // load the model and metadata
            // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
            // or files from your local hard drive
            // Note: the pose library adds "tmImage" object to your window (window.tmImage)
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            // Convenience function to setup a webcam
            const flip = false; // whether to flip the webcam
            webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
            await webcam.setup({ facingMode: "environment" }); // request access to the webcam
            await webcam.play();
            window.requestAnimationFrame(loop);

            // append elements to the DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }

            statusDiv = document.createElement('div');
            statusDiv.style.position = "absolute";
            statusDiv.style.top = "50%";
            statusDiv.style.left = "30%";
            statusDiv.style.transform = "rotate(-0deg)";
            statusDiv.style.fontSize = "50pt";
            document.body.appendChild(statusDiv);

        }

        async function loop() {
            webcam.update(); // update the webcam frame
            await predict();
            setTimeout(()=>{
                window.requestAnimationFrame(loop);
            },200)
            
        }

        // run the webcam image through the image model
        async function predict() {
            document.getElementById("loadingMsg").style.display = 'none';

            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            let predictedClasses = [];            
            for (let i = 0; i < maxPredictions; i++) {
                var probability = prediction[i].probability.toFixed(2);
                var className = prediction[i].className;
                if(probability > 0.9) {
                    probability = `<b style="color:green">${probability}</b>`;
                    predictedClasses.push(className);
                }
                const classPrediction =
                    prediction[i].className + ": " + probability;
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }
            displayRecognitionResult(predictedClasses);
        }

        function displayRecognitionResult(classes) {
            if(classes.length == 0) {
                document.body.style.backgroundColor = 'gray';
                statusDiv.innerHTML = '? ? ? <br\><span style="font-size:25px;color:blue;">(Point camera to the Hand Symbol)</span>';
            }
            if(classes.length == 1) {
                const handStatus = handSymbols[classes[0]];
                if (handStatus === 'A') {
                    document.body.style.backgroundColor = '#9FE2BF';
                    statusDiv.innerHTML = classes[0] + '<br\><span style="color:green;">Healthy</span>';
                }
                if (handStatus === 'B') {
                    document.body.style.backgroundColor = '#9FE2BF';
                    statusDiv.innerHTML = classes[0] + '<br\><span style="color:green;">Healthy</span>';
                }
                if (handStatus === 'C') {
                    document.body.style.backgroundColor = '#9FE2BF';
                    statusDiv.innerHTML = classes[0] + '<br\><span style="color:green;">Healthy</span>';
                }
                if (handStatus === 'D') {
                    document.body.style.backgroundColor = '#9FE2BF';
                    statusDiv.innerHTML = classes[0] + '<br\><span style="color:green;">Healthy</span>';
                }
                if (handStatus === 'E') {
                    document.body.style.backgroundColor = '#9FE2BF';
                    statusDiv.innerHTML = classes[0] + '<br\><span style="color:green;">Healthy</span>';
                }
                if (handStatus === 'Nothing') {
                    document.body.style.backgroundColor = '#FFA07A';
                    statusDiv.innerHTML = classes[0] + '<br\><span style="color:red;">NOT Healthy</span>';
                }
            }
            if(classes.length > 1) {
                document.body.style.backgroundColor = 'yellow';
                statusDiv.textContent = 'Confused !';
            }

        }
