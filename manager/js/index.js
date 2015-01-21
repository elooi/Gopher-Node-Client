$(document).ready(function () {    
    var template = {
        project: '' 
    };
       
    function ajaxGetProjects(){
        var sendData = {
            projectID: 0
        };
        $.ajax({
            type: 'POST',
            url: 'getProjects.do',
            traditional: true,
            data: sendData,
            success: function (data) {
                data = JSON.parse(data);
                
                $('#projects').empty();
                if(data.length>0){
                    var rows='';
                    for(var i=0; i<data.length; i++){
                        var row = template.project; 
                        row = row.replace(/##ProjectName##/g,data[i].Name);
                        row = row.replace(/##ID##/g,data[i].ID);
                        row = row.replace('##ProxyHostPort##', data[i].ProxyHostPort);
                        row = row.replace('##ProjectLink##',data[i].ProjectLink);
                        row = row.replace('##ForwardHostName##',data[i].ForwardHostName);
                        row = row.replace('##ForwardHostPort##',data[i].ForwardHostPort);
                        if(data[i].isProxyPortRunning == true){
                            row = row.replace('##powerStyle##','');
                        }else{
                            row = row.replace('##powerStyle##','poweroff');
                        }
                        rows += row;
                    }
                    $('#projects').append(rows);
                    
                    $('#projects').find('div[data-role="project"]').each(function(){
                       if($(this).find('div[data-role="power"]').hasClass('poweroff') === false){
                           $(this).find('div[data-role="edit"]').addClass('disabled');
                       }else{
                           $(this).find('div[data-role="edit"]').removeClass('disabled');
                       } 
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            complete: function (jqXHR, textStatus) {
            }
        });
    }
    
    
    
    function closeServer(_projectID,_callBack) {
        $.ajax({
            type: 'POST',
            url: 'closeServer.do',
            traditional: true,
            data: {projectID: _projectID},
            success: function (data) {
                console.log(data);
                _callBack(null);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            complete: function (jqXHR, textStatus) {
            }
        });
    }
    
    

    //Event binding 
    
    $('#projects').on('click','div[data-role="project"] div[data-role="edit"]',function(){
        var projectID = $(this).closest('div[data-role="project"]').data('projectid');
        location.replace('project.html?projectID='+projectID);
    });
    
    $('#projects').on('click','div[data-role="project"] div[data-role="lunch"]',function(){
        var projectElm = $(this).closest('div[data-role="project"]');
        var postData = {
            projectID: Number($(projectElm).data('projectid')),
            proxyHostPort: Number($(projectElm).data('proxy_host_port')),
            forwardHostName: $(projectElm).data('forward_host_name'),
            forwardHostPort: Number($(projectElm).data('forward_host_port'))
        };
        
        $.ajax({
            type: 'POST',
            url: 'lunchProject.do',
            traditional: true,
            data: postData,
            success: function (data) {
                if(data === 'ready' || data==='running'){
                    $('#projects').find('div[data-projectid="'+$(projectElm).data('projectid') +'"] div[data-role="power"]').removeClass('poweroff');
                    setTimeout(function(){
                        window.open($(projectElm).data('project_link'));
                    },500);
                    
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            },
            complete: function (jqXHR, textStatus) {
            }
        });
    });
    
    $('#projects').on('click', 'div[class="action-pane"] div[data-role="power"]', function () {
        var powerBtn = $(this);
        if ($(powerBtn).hasClass('poweroff') === false) {
            $.ajax({
                type: 'POST',
                url: 'closeServer.do',
                traditional: true,
                data: {proxyHostPort: $(powerBtn).closest('div[data-role="project"]').data('proxy_host_port')},
                success: function (data) {
                    console.log(data);
                    $(powerBtn).addClass('poweroff');
                    $(powerBtn).siblings('div[data-role="edit"]').show();
                },
                error: function (jqXHR, textStatus, errorThrown) {

                },
                complete: function (jqXHR, textStatus) {
                }
            });
        }
    });
    
    
    
    //Page Starts
    template.project = (function(){
        var elm = $('#projects').find('div[data-role="template-project"]').prop('outerHTML');
        var newElm = $(elm).removeClass('initial-state');
        $(newElm).attr('data-role','project');
        $('#projects').empty();
        return $(newElm).prop('outerHTML');
    }());
    
    ajaxGetProjects();
    
    
});

