class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3,color="blue"){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        // set variables for car driving mechanics
        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;

        // variable to determine if car is damaged from collision
        this.damaged=false;

        // variable to determine if car will be connected to the brain
        this.useBrain=controlType=="AI";

        // create sensor and brain for AI cars
        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount,6,4] // 6 hidden layers and 4 output layers
            );
        }

        // create controls for all cars
        this.controls=new Controls(controlType);

        // create image and mask for car
        this.img=new Image();
        this.img.src="car.png"
        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;
        const maskCtx=this.mask.getContext("2d");
        this.img.onload=()=>{
            maskCtx.fillStyle=color;
            maskCtx.rect(0,0,this.width,this.height); //create a rectangle
            maskCtx.fill();
            maskCtx.globalCompositeOperation="destination-atop"; // this causes the newly drawn content to be displayed only where it overlaps with the existing content 
            maskCtx.drawImage(this.img,0,0,this.width,this.height); //create a mask using img of a car
        }
    }

    update(roadBorders,traffic){

        // if the car has not collided yet, move the car and check for collision
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders,traffic);
        }
        // if the car have sensor and brain, update the sensor and feed the sensor readings to the brain
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    #assessDamage(roadBorders,traffic){
        // uses polyIntersect function in the utils.js to check whether the car has collided with roadBorders or traffic 
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){

        // this returns the vertices of the car (polygon) in the form of an array

        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){

        // this function moves the car based on the controls and car driving mechanics

        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,drawSensor=false){

        // draw the sensor for the best car 
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }

        // Draw the car on the canvas, adjusting its position and orientation.
        // If undamaged, apply a blending effect using a mask.
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        if(!this.damaged){
            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.globalCompositeOperation="multiply";
        }
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
        ctx.restore();

    }
}