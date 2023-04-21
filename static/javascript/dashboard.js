$(document).ready(function () {
    $('.ajax').click(function () {
        
        var projectType = $(this).attr('id'); // Get the ID of the clicked button
        var url = '/api/project-category-request/' + projectType; // Construct the URL with the button ID
        var container = $("#projects-container");
        const div = document.createElement('div');
        div.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only"></span></div>';
        container.empty();
        container.append(div);

        // Disable the clicked button
        $(this).prop('disabled', true);

        $.ajax({
            url: url,
            type: 'GET',
            success: function (projects) {
                container.empty();
                // Loop over the projects and create a new element for each one
                for (var i = 0; i < projects.length; i++) {
                    var project = projects[i];

                    // Create the button element
                    var button = $('<button>').addClass('full-size-button').attr({
                        'type': 'button',
                        'data-toggle': 'collapse',
                        'data-target': '#more-info-' + i,
                        'aria-expanded': 'false',
                        'aria-controls': 'more-info-' + i
                    }).text(project.name);

                    // Create the collapse element
                    var collapse = $('<div>').addClass('collapse text-center').attr('id', 'more-info-' + i);

                    // Define header elements
                    var tagsHeader = $('<h5>').text("Tags:");
                    var volunteersHeader = $('<h5>').text("Volunteers:");
                    var applicationsHeader = $('<h5>').text("Applications:");
                    var descriptionHeader = $('<h5>').text("Description:");
                    var goalsHeader = $('<h5>').text("Goals:");
                    var expectationsHeader = $('<h5>').text("Expectations:");
                    var timeCommitmentHeader = $('<h5>').text("Time Commitment:");

                    // Define paragraph elements
                    var tags = $('<p>').text(project.tags);
                    var volunteers = $('<p>').text(project.volunteers);
                    var applications = $('<p>').text(project.applications);
                    var description = $('<p>').text(project.description);
                    var goals = $('<p>').text(project.goals);
                    var expectations = $('<p>').text(project.expectations);
                    var timeCommitment = $('<p>').text(project.time_commitment);

                    // Define buttons
                    console.log(project._id);
                    var deleteProject = $('<button>').text("Delete Project").attr('id', project._id.toString().padStart(7, "0")).addClass('project-delete');

                    // Append the elements to the collapse element in the desired order
                    collapse.append(
                        tagsHeader,
                        tags,
                        volunteersHeader,
                        volunteers,
                        applicationsHeader,
                        applications,
                        descriptionHeader,
                        description,
                        goalsHeader,
                        goals,
                        expectationsHeader,
                        expectations,
                        timeCommitmentHeader,
                        timeCommitment,
                        deleteProject
                    );

                    // Create the project element and add the button and collapse elements
                    var projectElement = $('<div>').addClass('project');
                    projectElement.append(button, collapse);

                    container.append(projectElement);
                }

                // Re-enable the clicked button after 5 seconds
                setTimeout(function() {
                    $('.ajax').prop('disabled', false);
                }, 1000);
            }
        });
    });
});


$(document).ready(function () {
    $('#projects-container').on('click', '.project-delete', function () {
        var project_id = $(this).attr('id');
        var url = '/api/project-delete/' + project_id;

        $.ajax({
            url: url,
            type: 'GET',
            success: function (projects) {
                console.log("delete");
            }
        });
    });
});

