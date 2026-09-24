
                let canvasElem = document.querySelector("canvas");
                var canvas = document.getElementById('canvas');
                var pincel = canvas.getContext('2d');
                var altura;
                var largura;
                let descponto;
                let calibracao;
                let centimeros;
                 var vlc;

                var arr = [];
                let x, y;
                
                let xf;
                let yf;
                let distancia;
                var img = new Image();
                img.src = "noimage.jpg";

                document.getElementById('inp').onchange = function (e) {
                        var img = new Image();
                        img.onload = draw;
                        img.onerror = failed;
                        img.src = URL.createObjectURL(this.files[0]);
                };

                function draw() {
                        var canvas = document.getElementById('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(this, 0, 0);
                }
                function failed() {
                        console.error("The provided file couldn't be loaded as an Image media");
                }

                img.onload = function () {

                        var canvas = document.getElementById('canvas');
                        canvas.width = this.width;
                        canvas.height = this.height;
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(this, 0, 0);
                        //  canvas.style.width = largura + "px";
                        //  canvas.style.height = altura + "px";
                        //  img.style.width = largura + "px";
                        //  img.style.height = altura + "px;"
                        //  pincel.drawImage(img, 0, 0);
                        //console.log(`width: ${this.width} - height: ${this.height}`);

                }
                //pega posição do mouse no canvas e carrega a lista de pontos denominada (arr[]) 

                function getMousePosition(canvas, event) {

                        let rect = canvas.getBoundingClientRect();
                        let x = event.clientX - rect.left;
                        let y = event.clientY - rect.top;
                        console.log("Coordenada x: " + x,
                                "Coordenada y: " + y);
                        alert("x : " + x + "\n" + "y : " + y);

                        var z = 0;
                        var x1 = x;

                        //cria um objeto com as coordenadas

                        obj = { descricao: descponto, posx: x, posy: y,distancia: distancia, vlc: vlc,calibracao: calibracao, centimetros: centimeros }

                        //adiciona o objeto na ultima posição do array[]

                        arr.push(obj);


                        //Pede a descrição do ponto
                        if (arr.length == 1) {
                                descponto = "p_" + arr.length;
                        }

                        if (arr.length == 2) {
                                descponto = "p_" + arr.length;
                        }

                        if (arr.length > 2) {
                                descponto = prompt("Por favor digite o nome do ponto", "Ponto nasio");
                        }

                        if (descponto != null) {
                                console.log(descponto);

                        }

                        //pinta o ponto na tela
                        var pto = document.querySelector('#image .ponto');
                        // if (pto !== null) pto.outerHTML = ''; // apago o ponto anterior, se houver

                        var div = document.getElementById('image');
                        var ponto = document.createElement("span");
                        ponto.className = "ponto";

                        ponto.style.cssText = "top: " + (parseInt(y) - 2.5) + "px; left: " + (parseInt(x) - 2.5) + "px;";
                        ponto.style.backgroundColor = "yellow";


                        ponto.textContent = descponto + " ";
                        ponto.textContent = ponto.textContent + "x:" + round(x, 2);
                        ponto.textContent = ponto.textContent + "y:" + round(y, 2);
                        div.appendChild(ponto); // crio o ponto de fato

                }


                function calcular() {

                        var x1 = 100;
                        var x2 = 200;
                        var y1 = 100;
                        var y2 = 200;
                        distancia = Math.sqrt(Math.pow(1 - 3, 2) + Math.pow(1 - 3, 2)); console.log('Distância: ${distancia}');
                        console.log("distância ** entre os pontos: x1(" + x1 + ") e x2 (" + x2 + ") é de (" + distancia + ")");

                }

                const round = (num, places) => {
                        if (!("" + num).includes("e")) {
                                return +(Math.round(num + "e+" + places) + "e-" + places);
                        } else {
                                let arr = ("" + num).split("e");
                                let sig = ""
                                if (+arr[1] + places > 0) {
                                        sig = "+";
                                }

                                return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
                        }
                }

                console.log(round(1.005, 2)); // 1.01

                canvasElem.addEventListener('mousedown', function (e) {
                       // if (!e.ctrlKey) {
                                //alert("É preciso teclar o ctrl");
                      //  } else {
                                //alert("clicado o control");
                                getMousePosition(canvasElem, e);

                                //itera na lista desenhando o caminho entre pontos 


                                for (var i = 1; i < arr.length; i++) {
                                        if (isImpar(i)) {

                                                //console.log("Array "+arr[i].posx);
                                               
                                                var x1 = arr[i - 1].posx;
                                                var x2 = arr[i].posx;
                                                  xf = x2;
                                             
                                                var y1 = arr[i - 1].posy;
                                                var y2 = arr[i].posy;
                                                   yf = y2;

                                                pincel.beginPath(); //abriu o caminho
                                                pincel.moveTo(arr[i - 1].posx, arr[i - 1].posy); //moveu o pincel para a posicao nos pontos x = 10 e y = 45;
                                                pincel.lineTo(arr[i].posx, arr[i].posy); // desenha a linha do ponto x = 10 terminhando no x = 180
                                                pincel.strokeStyle = "red"; //adiciona um estilo na linha de contorno
                                                pincel.stroke(); //desenhando os contornos dos desenhos do path
                                                arr[i].descricao = descponto;

                                                //calcula distancia

                                                distancia = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)); console.log("Distância: ${distancia}");
                                                arr[i].distancia = distancia;
                                                console.log("distância entre os pontos: x1(" + x1 + ") e x2 (" + x2 + ") é de (" + distancia + ")");
                                              
                                              
                                              // ***** ver alert("distancia:"+distancia);
                                                arr[i].centimetros = document.getElementById('centimetros').value;
                                                arr[1].calibracao = arr[1].distancia;
                                                //alert("array [1] = "+arr[1].distancia);


                                                // alert(descponto+" "+ distancia);
                                                obj.descponto = descponto;
                                                obj.distancia = distancia;

                                                //descrição do ponto de origem do ponto inicial
                                                var descpt = document.getElementById('descricao');
                                                descpt.value = arr[i - 1].descponto;

                                                //descricao do ponto destino do ponto inicial
                                                var descptb = document.getElementById('descricaob');
                                                descptb.value = arr[i].descponto;

                                                // ponto x inicial A
                                                var origem = document.getElementById('pointa');
                                                origem.value = arr[i - 1].posx;
                                                // ponto x final  B 
                                                var destino = document.getElementById('pointb');
                                                destino.value = arr[i].posx;

                                                // ponto y inicial A	
                                                var origemy = document.getElementById('origemy');
                                                origemy.value = arr[i - 1].posy;

                                                //ponto y final B	
                                                var destinoy = document.getElementById('destinoy');
                                                destinoy.value = arr[i].posy;

                                                // atribuindo o valor do input centimetros   
                                                var cent = document.getElementById('centimetros').value;

                                                //pegando a distância em pixel e atribuindo na variavel dispixel
                                                var dispixel = document.getElementById('distpixel');
                                                dispixel.value = distancia;

                                                //atribuindo o valor do input milimetros em mm
                                                var mm = document.getElementById('milimetros');

                                                //convertendo em centimetros (multiplicamos por dez) e atribuimos ao input na tela
                                                mm.value = cent * 10;

                                                //pega o valor do input da tela e atribui na variavel mmm
                                                var mmm = document.getElementById('milimetros').value;


                                                //cria uma variavel milimetros que recebe o valor de centimetros convertidos em mm
                                                var milimetros = (centimeros * 10);
                                                //atribuimos a distância da régua na variável vlcalib pegando a posição do arr[na posição 1] que representa a segunda marcação  
                                                // deduzindo que a posição 0 do array que pega os pontos tem distância = 0 e que os dois primeiros pontos referem-se ao valor da régua p1 e p2
                                                var vlcalib = document.getElementById('vlcalibracao');
                                                vlcalib.value = arr[1].distancia;
                                                //atribuimos o valor da primeira distãncia (valor da distância capturado na régua) em vlcl
                                                var vlc1 = document.getElementById('vlcalibracao').value;

                                                var dist = distancia;

                                                vlc = (mmm * dist) / vlc1;
                                                vlc = vlc / 10
                                               

                                                var inputvlc = document.getElementById('distcalib');

                                                inputvlc.value = round(vlc, 2) + "mm/cm";

                                                console.log("vlc = " + vlc);
                                                arr[i].vlc = vlc;

                                                // var dist_calibrada = ((cent*10)*dispixel)/dist_calibrada;

                                                // var dis = document.getElementById('distcalib');
                                                // dis.value = dist_calibrada.value;

                                                // console.log("Centimetros :"+cent);
                                                //console.log("milimetros :"+cent*10);
                                                //console.log("Calibração :"+vlcalib);
                                                
                                                
                                            
                                                console.log("descriação: "+arr[i].descponto);
                                                console.log("posição de x(inicial): "+arr[i].posx);
                                               // console.log("posição de x(final): "+arr[i].xf);
                                                console.log("posição de y(inicial): "+arr[i].posy);
                                               // console.log("posição de y(final) : "+arr[i].yf);
                                                console.log("distância em pixel: "+ arr[i].distancia);
                                                console.log("calibração: "+ arr[1].distancia);
                                                console.log("centimetros selecionados: "+ arr[i].centimetros);
                                                console.log("distância em cm já calibrados: "+ arr[i].vlc);
                                                var v = arr[i].vlc;
                                                 console.log("distância em cm já calibrados arredontado: "+ round(v,2));
                                                
                                                
                                                
                                                

                                       // }
                                }
                               
                        }
                });

 
                function isImpar(n) {
                        return n % 2 === 1;
                }

            