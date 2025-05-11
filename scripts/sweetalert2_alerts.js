document.addEventListener('DOMContentLoaded', function () {
    // SweetAlert2 examples
    document.getElementById('basic-alert').addEventListener('click', function () {
        Swal.fire('This is a basic alert!');
    });

    document.getElementById('success-alert').addEventListener('click', function () {
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your operation was successful.',
        });
    });

    document.getElementById('custom-alert').addEventListener('click', function () {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Your item has been deleted.',
                    'success'
                );
            }
        });
    });
});