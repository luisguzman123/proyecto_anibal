
        <div class="phone-container">
            <input type="text" id="pass" value="" hidden>
            <div class="screen">
                <h2>Ingresa el Patr�n</h2>
                <div class="pattern-grid">
                    <!-- Creaci�n de los puntos del patr�n -->
                    <div class="pattern-node" data-node="1"></div>
                    <div class="pattern-node" data-node="2"></div>
                    <div class="pattern-node" data-node="3"></div>
                    <div class="pattern-node" data-node="4"></div>
                    <div class="pattern-node" data-node="5"></div>
                    <div class="pattern-node" data-node="6"></div>
                    <div class="pattern-node" data-node="7"></div>
                    <div class="pattern-node" data-node="8"></div>
                    <div class="pattern-node" data-node="9"></div>
                </div>
                <button class="reset-btn" onclick="resetPattern()">Restablecer</button>
            </div>
        </div>

    <style>
        /* Estilo del "tel�fono" */
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f4;
        }

        .phone-container {
            width: 300px;
            height: 500px;
            background-color: #333;
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .screen {
            width: 100%;
            height: 100%;
            background-color: #fff;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
        }

        h2 {
            font-size: 18px;
            color: #333;
        }

        /* Estilo de la cuadr�cula del patr�n */
        .pattern-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 20px;
            width: 80%;
        }

        .pattern-node {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid #333;
            background-color: #fff;
            transition: background-color 0.3s ease;
            cursor: pointer;
        }

        /* Estado del nodo activado */
        .pattern-node.active {
            background-color: #4CAF50;
        }

        /* Bot�n para restablecer el patr�n */
        .reset-btn {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .reset-btn:hover {
            background-color: #45a049;
        }

    </style>
    <script>
                    // Variables globales
                    let pattern = [];
                    let isDrawing = false;

// A�adir eventos a cada nodo
                    const nodes = document.querySelectorAll('.pattern-node');
                    nodes.forEach(node => {
                        node.addEventListener('mousedown', startDrawing);
                        node.addEventListener('mouseover', trackPattern);
                        node.addEventListener('mouseup', endDrawing);
                    });

// Funci�n para iniciar el dibujo
                    function startDrawing(event) {
                        isDrawing = true;
                        const node = event.target;
                        node.classList.add('active');
                        pattern.push(node.dataset.node);
                    }

// Funci�n para seguir el patr�n cuando se mueve sobre otros nodos
                    function trackPattern(event) {
                        if (isDrawing) {
                            const node = event.target;
                            if (!node.classList.contains('active')) {
                                node.classList.add('active');
                                pattern.push(node.dataset.node);
                            }
                        }
                    }

// Funci�n para finalizar el dibujo
                    function endDrawing() {
                        isDrawing = false;
                        console.log("Patr�n ingresado:", pattern);
                        
                        //alert("Patr�n ingresado: " + pattern.join('-'));
                        $("#pass").val(pattern.join('-'));
                    }

// Funci�n para restablecer el patr�n
                    function resetPattern() {
                        pattern = [];
                        nodes.forEach(node => node.classList.remove('active'));
                    }

    </script>


