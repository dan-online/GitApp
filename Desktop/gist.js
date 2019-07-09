const { clipboard } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.href.endsWith("discover")) {
    new Notification("Error in upload!", {
      body: "You are not logged in!"
    });
    setTimeout(() => {
      window.close();
    }, 2000);
    return;
  }
  if (
    Array.from(document.getElementsByTagName("button")).find(
      b => b.innerHTML == "Download ZIP"
    )
  ) {
    new Notification("Success", {
      body: "Link copied to clipboard!"
    });
    return clipboard.writeText(window.location.href);
  }
  var txtContent = clipboard.readText();
  var filename = window.location.href.split("?filename=")[1];
  if (!filename) return;
  const filenameinput = document.querySelector(
    "[aria-label='Filename including extension…']"
  );
  const descriptioninput = document.querySelector(
    "[aria-label='Gist description']"
  );
  const textarea = document.getElementsByTagName("textarea")[0];

  descriptioninput.value = "Uploaded through GitApp";
  filenameinput.value = filename;
  textarea.value = txtContent;
});
