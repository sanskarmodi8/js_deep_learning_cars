class Road{
    constructor(x,width,laneCount=3){
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;

        this.left=x-width/2;
        this.right=x+width/2;

        // create variables to represent infinitely long road
        const infinity=1000000;
        this.top=-infinity;
        this.bottom=infinity;

        // create borders of the road
        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right,y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right,y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }

    // gives the center of the lane at the given lane index 
    getLaneCenter(laneIndex){
        const laneWidth=this.width/this.laneCount;
        return this.left+laneWidth/2+
            Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        // draws the dashed lines on the road for the lanes
        for(let i=1;i<=this.laneCount-1;i++){
            const x=lerp(    //uses linear interpolation function defined in the utils.js to get the x coordinate of the lanes
                this.left,
                this.right,
                i/this.laneCount
            );
            
            ctx.setLineDash([20,20]); //dash of 20 pixels with 20 pixels of gap before the next dash
            ctx.beginPath();
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }

        // draws the borders of the road
        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }
}