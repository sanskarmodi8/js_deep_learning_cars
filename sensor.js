class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;
        this.rays=[];
        this.readings=[]
    }

    update(roadBorders,traffic){
        this.#castRays();
        this.readings = [];
        for(let i=0;i<this.rays.length;i++){
            this.readings.push(this.#getRayReading(this.rays[i],roadBorders,traffic));
        }
    }
    #getRayReading(ray,borders,traffic){
        let touches = [];
        for(let i=0;i<borders.length;i++){
            const intersection = getIntersection(ray[0], ray[1], borders[i][0], borders[i][1]);
            if(intersection){
                touches.push(intersection);
            }
        }
        for(let i=0;i<traffic.length;i++){
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const intersection = getIntersection(ray[0], ray[1], poly[j], poly[(j + 1) % poly.length]);
                if(intersection){
                    touches.push(intersection);
                }
            }
        }
        if(touches.length==0){
            return null;
        }
        else{
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }

    }
    #castRays(){
        this.rays = [];
        for(let i=0;i<this.rayCount;i++){
            const angle =lInterpolate(this.raySpread/2,-this.raySpread/2,this.rayCount==1?0.5:i/(this.rayCount-1))+this.car.angle;
            const start = {x:this.car.x,y:this.car.y};
            const end = {x:this.car.x -Math.sin(angle)*this.rayLength,y:this.car.y -Math.cos(angle)*this.rayLength};
        
            this.rays.push([start,end])
        }
    }

    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x,this.rays[i][1].y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();
        }
    }
}