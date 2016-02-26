/*
 *   FileSema je jQuery plugin koji omogućava dinamičku selekciju i brisanje fajlova.
 *   Za svaki odabir fajlova generiše se sakriveni input tag sa izabranim fajlovima i div tag sa nazivima fajlova i opcijom za brisanje.
 *   Plugin manipuliše elementima samo na klijentskoj strani, snimanje fajlova na serveru je potrebno posebno implementirati.
*/



;(function ($) {


    var debugging = false;

    var classActive = "fs-add",
        classFilesAdded = "fs-files",
        classSelectElement = "fs-select",
        classLabel = "fs-label",
        selectorActive,
        counter = 1;


    $.fn.FileSema = function (userParameters) {

        var defaultParameters = {
            wrapperClass: "fs-wrapper",
            containerClass: "fs-container",
            selectElement: {
                element: "button",
                type: "button",
                classes: "btn btn-sm btn-default",
                text: "Select files"
            },
            deleteTitle: "Delete"
        };
        var parameters = $.extend(true, defaultParameters, userParameters);
        selectorActive = this.prop("tagName").toLowerCase() + "[class='" + classActive + "']";

        $(this).wrap($("<div>").attr({ "class": parameters.wrapperClass }));

        var selectElement =
            $("<" + parameters.selectElement.element + ">")
                  .attr({
                      type: parameters.selectElement.type,
                      "class": classSelectElement + " " + parameters.selectElement.classes
                  })
                  .text(parameters.selectElement.text)
                  .insertAfter(this)
                  .bind("click", function () {
                      if (debugging) alert("Select element: Clicked");
                      $(selectorActive).trigger("click");
                  });

        $("<div>").attr({ "class": parameters.containerClass }).insertAfter(selectElement);

        $(this).addClass(classActive)
               .hide()
               .bind("change", function (event) {
                   InputChangeHandler(event, parameters);
               });

        return this;

    };


    function InputChangeHandler(event, parameters) {
        var currentInput = event.target;
        var files = currentInput.files;
        //
        if (debugging) alert("Current input (class: " + $(currentInput).attr("class") + "): Changed (" + files.length + " files selected)");
        //
        if (files.length > 0) {
            //
            var newInput = $(currentInput).clone(false);
            $(currentInput).unbind();
            $(newInput).bind("change", function (event) {
                InputChangeHandler(event, parameters);
            });
            $(currentInput).parent().prepend($(newInput));
            //
            var newClassForCurrentInput = classFilesAdded + "-" + counter;
            $(currentInput).removeClass(classActive).addClass(newClassForCurrentInput);
            //
            var fileNames = [];
            $.each(files, function (index, file) {
                fileNames.push(file.name);
            });
            //
            var newClassForCurrentLabel = classLabel + "-" + counter;
            var labelDiv = $("<div>").addClass(classLabel).addClass(newClassForCurrentLabel)
                                     .appendTo($("." + parameters.containerClass));
            var labelA = $("<a>").attr({ title: parameters.deleteTitle })
                                 .bind("click", function () {
                                     if (debugging) alert("Delete (class: " + $(this).attr("class") + "): Clicked");
                                     $(this).parent("div").remove();
                                     $("input." + newClassForCurrentInput).remove();
                                 });
            var labelSpan = $("<span class='glyphicon glyphicon-remove'></span>").appendTo($(labelA));
            $(labelA).appendTo($(labelDiv));
            $(labelDiv).append(fileNames.join(" / "));
            //
            counter++;
        }
    };


}(jQuery));

