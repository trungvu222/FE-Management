document.addEventListener("DOMContentLoaded", function () {
  fetch("https://api.example.com/jobs") // Thay thế URL bằng endpoint thực tế của backend
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document
        .getElementById("jobTable")
        .getElementsByTagName("tbody")[0];
      data.forEach((item, index) => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);

        cell1.innerHTML = index + 1;
        cell2.innerHTML = item.jobId;
        cell3.innerHTML = item.status;
        cell4.innerHTML = item.triggerDesc;
        cell5.innerHTML = item.jobGroup;
        cell6.innerHTML = `<button class="edit-btn">Edit</button><button class="stop-btn">Stop</button>`;
        cell7.innerHTML = item.following
          ? '<button class="unfollow-btn">Unfollow</button>'
          : '<button class="follow-btn">Follow</button>';

        // Gắn sự kiện cho các nút
        row.querySelector(".edit-btn").addEventListener("click", function () {
          editJob(item.jobId);
        });
        row.querySelector(".stop-btn").addEventListener("click", function () {
          stopJob(item.jobId);
        });
        row.querySelector(".follow-btn").addEventListener("click", function () {
          followJob(item.jobId);
        });
        row
          .querySelector(".unfollow-btn")
          .addEventListener("click", function () {
            unfollowJob(item.jobId);
          });
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function editJob(jobId) {
  console.log("Editing job", jobId);
  // Thêm logic chỉnh sửa công việc
}

function stopJob(jobId) {
  console.log("Stopping job", jobId);
  // Thêm logic dừng công việc
}

function followJob(jobId) {
  console.log("Following job", jobId);
  // Thêm logic theo dõi công việc
}

function unfollowJob(jobId) {
  console.log("Unfollowing job", jobId);
  // Thêm logic bỏ theo dõi công việc
}
