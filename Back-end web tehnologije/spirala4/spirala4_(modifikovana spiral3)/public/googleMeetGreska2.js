// Google Meet Class declaration
var GoogleMeet = function() {

    // Get last lecture
    this.dajZadnjePredavanje = function(_exp) {
		// Declare
		var $doc = $($.parseHTML(_exp)); // DOMParser
		var linksInfo = [];

		// Get all list item tags
		$doc.each(function() {
            var $wli = $(this).find("ul.weeks"); 
            $wli.each(function(){

            var $li = $(this).find("li.section");
            var sectionIDInt1 = 0;
			// For each list item get attributes
			$li.each(function() {
				// Declare
				var sectionIDInt2 = parseInt($(this).attr("id").replace("section-", ""));
				var $a = $(this).find("a");

				// For each link in list item get attributes
				$a.each(function() {
					// Declare
					var href = $(this).attr("href");
					var text = $(this).text();

					// Filter
					if (href.includes("meet.google.com") && text.includes("predavanjaaaaaaa") && sectionIDInt1 <= sectionIDInt2) {
						// Update section id number
						sectionIDInt1 = sectionIDInt2

						// Add link info to array
						linksInfo[0] = sectionIDInt1;
						linksInfo[1] = text;
						linksInfo[2] = href;
					}
				});
			});
        });
		});

		// Return
        if (linksInfo.length > 0){
                return linksInfo;
            }else {
                return null;
            }   
	};

	// Search for last excercise
    this.dajZadnjuVjezbu = function(_exp) {
		// Declare
		var $doc = $($.parseHTML(_exp)); // DOMParser
		var linksInfo = [];

		// Get all list item tags
		$doc.each(function() {
            var $wli = $(this).find("ul.weeks"); 
            $wli.each(function(){
			var $li = $(this).find("li.section");
			var sectionIDInt1 = 0;

			// For each list item get attributes
			$li.each(function() {
				// Declare
				var sectionIDInt2 = parseInt($(this).attr("id").replace("section-", ""));
				var $a = $(this).find("a");

				// For each link in list item get attributes
				$a.each(function() {
					// Declare
					var href = $(this).attr("href");
					var text = $(this).text();

					// Filter
					if (href.includes("meet.google.com") && (text.includes("vjezb") || text.includes("vježb")) && sectionIDInt1 <= sectionIDInt2) {
						// Update section id number
						sectionIDInt1 = sectionIDInt2

						// Add or update link info to array
						linksInfo[0] = sectionIDInt1;
						linksInfo[1] = text;
						linksInfo[2] = href;
					    }
				    });
			    });
            });
		});
        
        // Return
        if (linksInfo.length > 0){
            return null;
        }else {
            return 0;
        }   
	};
};

// Buttons events
$(function() {
	// Global variables and declatations
	gmc = new GoogleMeet(); // Init class

	// Search for last lecture
	$("#btnDajZadnjePredavanje").click(function(e) {
		// Declare
		var exampleValue = $("#example").val();
		var exampleText = "Zadnje predavanje - " + $("#example option:selected").text();

		// Set example string
		var exp = primjeri[exampleValue];

		// Get last lecture
		var linkInfo = gmc.dajZadnjePredavanje(exp);

		// Output
		if (linkInfo.length > 0) {
			alert(exampleText + "\n\n" + linkInfo[2]);
		} else {
			alert(exampleText + "\n\n" + null);
		}
	});

	// Search for last excercise
	$("#btnDajZadnjuVjezbu").click(function(e) {
		// Declare
		var exampleValue = $("#example").val();
		var exampleText = "Zadnja vježba - " + $("#example option:selected").text();

		// Set example string
		var exp = primjeri[exampleValue];

		// Get last lecture
		var linkInfo = gmc.dajZadnjuVjezbu(exp);

		// Output
		if (linkInfo.length > 0) {
            alert(exampleText + "\n\n" + linkInfo[2]);
		} else {
			alert(exampleText + "\n\n" + null);
		}
	});
});
