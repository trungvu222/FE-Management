document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:8080/status") // Thay thế bằng API thực tế của bạn
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const tableBody = document
        .getElementById("jobTable")
        .getElementsByTagName("tbody")[0];
      if (!tableBody) {
        console.error("Table body not found!");
        return;
      }

      const dataArray = Array.isArray(data) ? data : [data]; // Ensure data is an array

      dataArray.forEach((item, index) => {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);

        cell1.innerHTML = index + 1;
        cell2.innerHTML = `Job-${item.idJob}`; // Chuyển đổi Job Id thành chuỗi
        cell3.innerHTML = item.jobstatus;
        cell4.innerHTML = item.triggerDesc;
        cell5.innerHTML = item.jobGroup;
        cell6.innerHTML = `
          <button onclick="editJob(${item.idJob})">Edit</button>
          <button onclick="stopJob(${item.idJob})" style="${item.jobstatus === 'Running' ? '' : 'display:none;'}">Stop</button>
        `; // Thêm nút Edit và Stop
        cell7.innerHTML = `
          <button id="follow-${item.idJob}" onclick="followJob(${item.idJob})" style="display:inline;">Follow</button>
          <button id="unfollow-${item.idJob}" onclick="unfollowJob(${item.idJob})" style="display:none;">Unfollow</button>
        `;
      });
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Function to handle follow job
  window.followJob = function(jobId) {
    const followButton = document.getElementById(`follow-${jobId}`);
    const unfollowButton = document.getElementById(`unfollow-${jobId}`);
    const statusSpan = document.getElementById(`status-${jobId}`);

    // Simulate API call to follow the job
    fetch(`http://localhost:8080/api/follow/${jobId}`, {
      method: "POST",
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Following job:", data);
      followButton.style.display = 'none';
      unfollowButton.style.display = 'inline';
      statusSpan.style.display = 'inline'; // Hiển thị trạng thái "Following"
    })
    .catch((error) => console.error("Error following job:", error));
  }

  // Function to handle unfollow job
  window.unfollowJob = function(jobId) {
    const followButton = document.getElementById(`follow-${jobId}`);
    const unfollowButton = document.getElementById(`unfollow-${jobId}`);
    const statusSpan = document.getElementById(`status-${jobId}`);

    // Simulate API call to unfollow the job
    fetch(`http://localhost:8080/api/unfollow/${jobId}`, {
      method: "POST",
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Unfollowed job:", data);
      followButton.style.display = 'inline';
      unfollowButton.style.display = 'none';
      statusSpan.style.display = 'none'; // Ẩn trạng thái "Following"
    })
    .catch((error) => console.error("Error unfollowing job:", error));
  }
});

function editJob(jobId) {
  const jobIDElement = document.getElementById(`job-id-${jobId}`);
  const triggerDescElement = document.getElementById(`trigger-desc-${jobId}`);
  const updatedJobId = jobIDElement.innerText.trim();
  const updatedTriggerDesc = triggerDescElement.innerText.trim();

  console.log("Editing job", jobId);
  fetch(`http://localhost:8080/edit-job/${jobId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jobId: updatedJobId,
      triggerDesc: updatedTriggerDesc,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Job edited:", data);
      // Optionally refresh the job row or show a success message
    })
    .catch((error) => console.error("Error editing job:", error));
}

function stopJob(jobId) {
  console.log("Stopping job", jobId);
  fetch(`http://localhost:8080/stop-job/${jobId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Job stopped:", data);
      // Update the job status in the UI
      document.querySelector(`#job-status-${jobId}`).innerText = "Stopped";
    })
    .catch((error) => console.error("Error stopping job:", error));
}

// function followJob(jobId) {
//   console.log("Following job", jobId);
//   // Giả sử endpoint là /follow-job
//   fetch(`http://localhost:8080/follow-job/${jobId}`, {
//     method: "POST",
//   })
//     .then((response) => response.json())
//     .then((data) => console.log("Following job:", data))
//     .catch((error) => console.error("Error following job:", error));
// }

// function unfollowJob(jobId) {
//   console.log("Unfollowing job", jobId);
//   // Giả sử endpoint là /unfollow-job
//   fetch(`http://localhost:8080/unfollow-job/${jobId}`, {
//     method: "POST",
//   })
//     .then((response) => response.json())
//     .then((data) => console.log("Unfollowed job:", data))
//     .catch((error) => console.error("Error unfollowing job:", error));
// }
