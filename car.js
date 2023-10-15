class Car{
    constructor(x,y,width,height, controlType,maxspeed=3){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height; 
        this.speed=0;
        this.accelaration=0.2;
        this.maxSpeed=maxspeed;
        this.friction=0.05;
        this.damaged=false;
        this.angle=0;
        this.useBrain = controlType=="AI";
        if(controlType!="DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount,6,4]);
        }
        this.controls = new Controls(controlType);
    }
    update(roadBorders,traffic=[]){
        if(!this.damaged){
            this.polygon = this.#createPolygon();
            this.#move();
            this.damaged = this.#assessDamage(roadBorders,traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets = this.sensor.readings.map(s=>s==null?0:1-s.offset);
            const outputs = NeuralNetwork.feedforward(offsets,this.brain);
            if(this.useBrain){
                this.controls.up = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.down = outputs[3];
            }
        }
        
    }
    #assessDamage(roadBorders,traffic){
        for(let i=0; i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0; i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }
    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width/2,this.height/2);
        const angle = Math.atan2(this.width,this.height);
        points.push({x:this.x-rad*Math.sin(this.angle-angle),y:this.y-rad*Math.cos(this.angle-angle)});
        points.push({x:this.x-rad*Math.sin(this.angle+angle),y:this.y-rad*Math.cos(this.angle+angle)});
        points.push({x:this.x-rad*Math.sin(Math.PI+this.angle-angle),y:this.y-rad*Math.cos(Math.PI+this.angle-angle)});
        points.push({x:this.x-rad*Math.sin(Math.PI+this.angle+angle),y:this.y-rad*Math.cos(Math.PI+this.angle+angle)});
        return points;
    }
    #move(){
        if(this.controls.up){
            this.speed += this.accelaration;
        }
        if(this.controls.down){
            this.speed -= this.accelaration;
        }
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }
        if(this.speed != 0){
            const flip = this.speed > 0 ? 1 : -1;
            if(this.controls.left){
                this.angle += 0.03*flip;
            }
            if(this.controls.right){
                this.angle -= 0.03*flip;
            }
        }
        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
    draw(ctx,color='darkgray',drawSensor=false){
        if(this.damaged){
            ctx.fillStyle = "gray";
        } else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}