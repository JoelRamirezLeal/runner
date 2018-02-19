var fondo;
var carro;
var cursores;
var enemigos;
var timer;
var timerGasolina;
var gasolinas;
var puntos;
var txtPuntaje;
var Juego = {
    preload: function(){
        juego.load.image('bg', 'img/bg.png');
        juego.load.image('carro', 'img/carro.png');
        juego.load.image('carroMalo', 'img/carroMalo.png');
        juego.load.image('gas', 'img/gas.png');
    },
    create:function(){
        puntos=0;
        fondo=juego.add.tileSprite(0, 0, 290, 540, 'bg')

        carro=juego.add.tileSprite(juego.width/2, 490, 30, 44, 'carro');
        carro.anchor.setTo(0.5);
        carro.enableBody=true;
        juego.physics.arcade.enable(carro);

        cursores=juego.input.keyboard.createCursorKeys();

        timer = juego.time.events.loop(1500, this.crearCarroMalo, this);

        timerGasolina = juego.time.events.loop(3650, this.crearGasolina, this);

        enemigos=juego.add.group();
        juego.physics.arcade.enable(enemigos);
        enemigos.enableBody= true;
        enemigos.createMultiple(5, 'carroMalo');
        enemigos.setAll('anchor.x', 0.5);
        enemigos.setAll('anchor.y', 0.5);
        enemigos.setAll('checkWorldBounds', true);
        enemigos.setAll('outOfBoundsKill', true);

        gasolinas=juego.add.group();
        juego.physics.arcade.enable(gasolinas);
        gasolinas.enableBody= true;
        gasolinas.createMultiple(5, 'gas');
        gasolinas.setAll('anchor.x', 0.5);
        gasolinas.setAll('anchor.y', 0.5);
        gasolinas.setAll('checkWorldBounds', true);
        gasolinas.setAll('outOfBoundsKill', true);

        txtPuntaje=juego.add.text(50,20, "0", {font: "24px Arial", fill:"#990000"});
    },
    update:function(){
        if(carro.alive==true){
            fondo.tilePosition.y+=2;
        }
        if(cursores.right.isDown && carro.position.x <245){
            carro.position.x+=4;
        }
        if(cursores.left.isDown && carro.position.x>45){
            carro.position.x-=4;
        }
        juego.physics.arcade.overlap(carro, enemigos, this.choque, null, this);
        juego.physics.arcade.overlap(carro, gasolinas, this.cogerGas, null, this);

        if(puntos<=5){
            timer.delay=1250;
        }else if(puntos>=6 && puntos<=10){
            timer.delay=1000;
        }else if(puntos>=11 && puntos<=15){
            timer.delay=750;
        }else if(puntos>=16 && puntos<=20){
            timer.delay=500;
        }else if(puntos>=21 && puntos<=25){
            timer.delay=250;
        }else{
            timer.delay=50;
        }

    },
    crearCarroMalo:function(){
        var posicion = Math.floor(Math.random()*3)+1;
        var enemigo = enemigos.getFirstDead();
        enemigo.physicsBodyType=Phaser.Physics.ARCADE;
        enemigo.reset(posicion*73, 0);
        enemigo.body.velocity.y=250;
    },
    crearGasolina:function(){
        var posicion = Math.floor(Math.random()*3)+1;
        var gasolina = gasolinas.getFirstDead();
        gasolina.physicsBodyType=Phaser.Physics.ARCADE;
        gasolina.reset(posicion*73, 0);
        if(puntos>=0 && puntos <=5){
            gasolina.body.velocity.y=250;
        }else if(puntos>=6 && puntos <=10){
            gasolina.body.velocity.y=280;
        }else{
            gasolina.body.velocity.y=320;
        }
        
    },
    choque:function(){
        enemigos.forEachAlive(function(e){
            e.body.velocity.y=0;
        });
        gasolinas.forEachAlive(function(g){
            g.body.velocity.y=0;
        });
        carro.kill();
        juego.time.events.remove(timer);
        juego.time.events.remove(timerGasolina);
    },
    cogerGas:function(car, gas){
        gas.kill();
        puntos++;
        txtPuntaje.text=puntos;
    }
};