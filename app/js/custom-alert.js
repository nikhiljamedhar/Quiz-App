function CustomDialog(options, element) {
    this.options = options;
    this.options.inputCheck = this.options.inputCheck || false;
    if(element) {
        this.element = element;
        this.decorateOverlay();
    } else {
        this.createOverlay()
    }
}
CustomDialog.prototype.decorateOverlay = function() {
    this.mask = this.element;
    this.setDefaultOverlaySettings();
}

CustomDialog.prototype.createOverlay = function() {
    var mask = document.createElement("div");
    mask.className = this.options.inputCheck ? "mask custom-dialog-mask" : "mask custom-dialog-mask no-input";
    mask.id = "mask";

    var input = this.options.inputCheck ? '<div class="input-container">' + '<input type="text" name="input" placeholder="'+ this.options.placeholder  +'" class="input"/>' +'</div>' : '';

    mask.innerHTML = '<div class="overlay">' +
        '<div class="wrapper">' +
            '<header>' +
                '<h4 class="title">'+ this.options.title +'</h4>' +
            '</header>' +
            '<section>' +
                '<p class="description">'+ this.options.description +'</p>' +

                input +

            '</section>' +
            '<footer class="clear">' +
                '<input type="button" name="button" value="Ok" class="ok left"/>' +
                '<input type="button" name="button" value="Cancel" class="close right"/>' +
            '</footer>' +
        '</div>' +
    '</div>';

    document.body.appendChild(mask);
    this.mask = mask;

    this.setDefaultOverlaySettings();
}
CustomDialog.prototype.setDefaultOverlaySettings = function() {
    this.overlay = this.mask.getElementsByClassName("overlay")[0];
    this.input = this.overlay.getElementsByClassName("input")[0];
    this.okButton = this.overlay.getElementsByClassName("ok")[0];
    this.closeButton = this.overlay.getElementsByClassName("close")[0];
    document.body.style.overflow = "hidden";
    this.createOverlayEvents();
}
CustomDialog.prototype.createOverlayEvents = function() {

    var self = this;
    self.inputText = "";

    if(this.input) {
        this.input.addEventListener("keyup", function() {
            self.inputText = this.value;
        });
    }
    this.okButton.addEventListener("click", function() {
        if(self.options.callback) {
            self.options.callback(self.getEvent('ok'));
        }
    });
    document.addEventListener("keyup", function(e) {
        if(self.options.callback && e.keyCode === 13) {
            self.options.callback(self.getEvent('ok'));
        }
    });
    document.addEventListener("keyup", function(e) {
        if(e.keyCode === 27) {
            self.disposeOverlay();
        }
    });
    this.closeButton.addEventListener("click", function() {
        self.disposeOverlay();
    });
}
CustomDialog.prototype.disposeOverlay = function() {
    this.mask.parentElement.removeChild(this.mask);
    document.body.style.overflow = "auto";
}
CustomDialog.prototype.setContent = function(overlayContent) {
    if(typeof overlayContent === "string") {
        this.overlay.innerHTML = overlayContent;
    } else {
        this.overlay.appendChild(overlayContent);
    }
}
CustomDialog.prototype.setMaskClassName = function(className) {
    this.mask.classList.add(className);
}
CustomDialog.prototype.getEvent = function(type) {
    return {
        type: type,
        result: type === "ok" ? true : false,
        context: this
    }
}
