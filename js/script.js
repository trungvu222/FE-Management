document.addEventListener("DOMContentLoaded", function () {
  // Hàm fetchData để lấy dữ liệu mới từ server
  function fetchData() {
    fetch("http://localhost:8080/status")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => updateTable(data))
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Hàm updateTable để cập nhật dữ liệu vào bảng
  function updateTable(data) {
    const tableBody = document.getElementById("jobTable").getElementsByTagName("tbody")[0];
    if (!tableBody) {
      console.error("Table body not found!");
      return;
    }

    // Xóa dữ liệu hiện tại trước khi thêm dữ liệu mới
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }

    const dataArray = Array.isArray(data) ? data : [data]; // Chắc chắn dữ liệu là 1 mảng
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
      cell2.innerHTML = item.jobId;
      cell3.innerHTML = item.jobstatus;
      cell4.innerHTML = item.triggerDesc;
      cell5.innerHTML = item.jobGroup;
      cell6.innerHTML = `
        <button onclick="editJob(${item.idJob})" id="edit-button-${item.idJob}">Edit</button>
        <button onclick="stopJob(${item.idJob})" style="${item.jobstatus === 'Running' ? '' : 'display:none;'}">Stop</button>
      `; // Thêm nút Edit và Stop
      cell7.innerHTML = `
        <button id="follow-${item.idJob}" onclick="followJob(${item.idJob})" style="display:inline;">Follow</button>
        <button id="unfollow-${item.idJob}" onclick="unfollowJob(${item.idJob})" style="display:none;">Unfollow</button>
      `;
    });
  }

  // Gọi hàm fetchData lần đầu khi trang được tải
  fetchData();

  // Thiết lập interval để tự động cập nhật dữ liệu mỗi 1 giây
  setInterval(fetchData, 1); // Cập nhật dữ liệu mỗi 1 giây

  // Hàm xử lý follow job
  window.followJob = function(jobId) {
    const followButton = document.getElementById(`follow-${jobId}`);
    const unfollowButton = document.getElementById(`unfollow-${jobId}`);
    const statusSpan = document.getElementById(`status-${jobId}`);

    // API gọi đến follow job
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

  // Hàm xử lý unfollow job
  window.unfollowJob = function(jobId) {
    const followButton = document.getElementById(`follow-${jobId}`);
    const unfollowButton = document.getElementById(`unfollow-${jobId}`);
    const statusSpan = document.getElementById(`status-${jobId}`);

    // API gọi đến unfollow job
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
  // Lấy các ô dữ liệu từ hàng cần chỉnh sửa
  const jobIDCell = document.querySelector(`#job-id-${jobId}`);
  const statusCell = document.querySelector(`#job-status-${jobId}`);
  const triggerDescCell = document.querySelector(`#trigger-desc-${jobId}`);
  const jobGroupCell = document.querySelector(`#job-group-${jobId}`);

  // Lưu giá trị hiện tại để có thể khôi phục nếu cần
  const currentJobId = jobIDCell.innerText;
  const currentStatus = statusCell.innerText;
  const currentTriggerDesc = triggerDescCell.innerText;
  const currentJobGroup = jobGroupCell.innerText;

  // Thay đổi nội dung các ô thành input fields để chỉnh sửa
  jobIDCell.innerHTML = `<input type='text' id='edit-job-id-${jobId}' value='${currentJobId}' />`;
  triggerDescCell.innerHTML = `<input type='text' id='edit-trigger-desc-${jobId}' value='${currentTriggerDesc}' />`;
  jobGroupCell.innerHTML = `<input type='text' id='edit-job-group-${jobId}' value='${currentJobGroup}' />`;

  // Thay đổi nút "Edit" thành nút "Save"
  const editButton = document.querySelector(`#edit-button-${jobId}`);
  editButton.innerText = 'Save';
  editButton.onclick = function() { saveJob(jobId); };
}

function saveJob(jobId) {
  const updatedJobId = document.getElementById(`edit-job-id-${jobId}`).value;
  const updatedTriggerDesc = document.getElementById(`edit-trigger-desc-${jobId}`).value;
  const updatedJobGroup = document.getElementById(`edit-job-group-${jobId}`).value;

  // Gửi dữ liệu đã cập nhật về server
  fetch(`http://localhost:8080/edit-job/${jobId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jobId: updatedJobId,
      triggerDesc: updatedTriggerDesc,
      jobGroup: updatedJobGroup
    }),
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("Job edited:", data);
    // Cập nhật lại UI sau khi chỉnh sửa thành công
    document.querySelector(`#job-id-${jobId}`).innerText = updatedJobId;
    document.querySelector(`#trigger-desc-${jobId}`).innerText = updatedTriggerDesc;
    document.querySelector(`#job-group-${jobId}`).innerText = updatedJobGroup;
    document.querySelector(`#edit-button-${jobId}`).innerText = 'Edit';
    document.querySelector(`#edit-button-${jobId}`).onclick = function() { editJob(jobId); };
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
      // Cập nhật trạng thái công việc trong UI
      document.querySelector(`#job-status-${jobId}`).innerText = "Stopped";
    })
    .catch((error) => console.error("Error stopping job:", error));
}