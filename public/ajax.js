$('#new-todo-form').submit(function (e) {
    e.preventDefault();
    var toDoItem = $(this).serialize();
    $.post('/todos', toDoItem, function (data) {
        // debugger
        $('#todo-list').append(
            `
            <li class="list-group-item">

            <form class="edit-item-form" action="/todos/${data._id}" method="POST">
                <div class="form-group">
                    <label>Item Text</label>
                    <input type="text" value="${data.text}" name="todo[text]" class="form-control">
                </div>
                <button class="btn btn-primary">Update Item</button>
            </form>
            <span class="lead">
                ${data.text}
            </span>
            <div class="pull-right">
                <button class="btn btn-sm btn-warning edit-button">Edit</button>
                <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
                    <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                </form>
            </div>
            <div class="clearfix"></div>
        </li>
    `
        )
        $('#new-todo-form').find('.form-control').val('');
    });
});


$('#todo-list').on('click', '.edit-button', function () {
    $(this).parent().siblings('.edit-item-form').show();
})

$('#todo-list').on('submit', '.edit-item-form', function (e) {
    e.preventDefault();
    var toDoItem = $(this).serialize();
    var actionUrl = $(this).attr('action');
    $originalItem = $(this).parent('.list-group-item');
    $.ajax({
        url: actionUrl,
        data: toDoItem,
        type: 'PUT',
        originalItem: $originalItem,
        success: function (data) {
            this.originalItem.html(
                `                     

                <form class="edit-item-form" action="/todos/${data._id}" method="POST">
                    <div class="form-group">
                        <label>Item Text</label>
                        <input type="text" value="${data.text}" name="todo[text]" class="form-control" class="delete-item-form">
                    </div>
                    <button class="btn btn-primary">Update Item</button>
                </form>
                <span class="lead">
                    ${data.text}
                </span>
                <div class="pull-right">
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <form style="display: inline" method="POST" action="/todos/${data._id}" class="delete-item-form">
                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                    </form>
                </div>
                <div class="clearfix"></div>
    `
            )
        }
    });
});

$('#todo-list').on('submit', '.delete-item-form', function (e) {
    e.preventDefault();
    var confirmResponse = confirm("are u sure ?");
    if (confirmResponse) {
        var actionUrl = $(this).attr('action');
        $itemToDelete = $(this).closest('.list-group-item');
        $.ajax({
            url: actionUrl,
            type: 'DELETE',
            itemToDelete: $itemToDelete,
            success: function (data) {
                this.itemToDelete.remove();
            }
        })
    }
    else {
        $(this).find('button').blur();
    }
})
