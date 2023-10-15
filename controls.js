class Controls{
    constructor(type){
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;

        switch(type){
            case "KEYS":
                this.#addKeyboardListeners();
                break;
            case "DUMMY":
                this.up = true;
                break;
        }
    }
    #addKeyboardListeners(){
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "ArrowUp":
                    this.up = true;
                    break;
                case "ArrowRight":
                    this.right = true;
                    break;
                case "ArrowDown":
                    this.down = true;
                    break;
            }
        }
        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "ArrowUp":
                    this.up = false;
                    break;
                case "ArrowRight":
                    this.right = false;
                    break;
                case "ArrowDown":
                    this.down = false;
                    break;
            }
        }
    }
}