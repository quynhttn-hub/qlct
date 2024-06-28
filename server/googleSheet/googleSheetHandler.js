const { JWT } = require("google-auth-library");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./deployed-quan-ly-chi-tieu-65c03a04a106.json");

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file", // note that sharing-related calls require the google drive scope
];

const jwt = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: SCOPES,
});

// sheet template
const template = new GoogleSpreadsheet(
  // "1Zqvtd0Usx6bqkEOOsZb26h-bDMMhpqxuwJjwMUKIFf0",
  "1lEj9UZX96G8JENi4vySsYid-wbIfiX5Z1ZraHnd7hQ8",
  jwt
);
// template.loadInfo()
const info = async () => {
  await template.loadInfo();
};

var templateSheetsAmount = 0;

info()
  .then(() => {
    templateSheetsAmount = template.sheetCount;
    // console.log("Số lượng sheet:", templateSheetsAmount);
  })
  .catch((error) => {
    console.log("Đã xảy ra lỗi:", error);
  });
// tạo file cho 1 người dùng
const createNewSheet = async (userMails) => {
  // tạo file mới
  const newDoc = await GoogleSpreadsheet.createNewSpreadsheetDocument(jwt, {
    title: "Quan ly chi tieu",
  });
  newDoc.loadInfo();

  // copy template sheets vào file mới
  for (let i = 0; i < templateSheetsAmount; i++) {
    const z = await template.sheetsByIndex[i].copyToSpreadsheet(
      newDoc.spreadsheetId
    );
  }

  // // rename sheet từ "bản sao của ..." -> "..."
  const duplicatedDoc = new GoogleSpreadsheet(newDoc.spreadsheetId, jwt);
  await duplicatedDoc.loadInfo();
  for (let i = 1; i < templateSheetsAmount + 1; i++) {
    const name = duplicatedDoc.sheetsByIndex[i].title.replace("Copy of ", "");
    duplicatedDoc.sheetsByIndex[i].updateProperties({ title: name });
  }

  //xoa sheet dau tien
  const sheet1 = duplicatedDoc.sheetsByIndex[0];
  await sheet1.delete();

  // share quyền cho user

  await Promise.all(
    userMails.map(async (mail) => {
      await newDoc.share(mail);
    })
  );
  const link = `https://docs.google.com/spreadsheets/d/${newDoc.spreadsheetId}`;
  return link;
};

// tạo file cho nhóm
const createNewSheetForGroup = async (userMails) => {
  // tạo file mới
  const newDoc = await GoogleSpreadsheet.createNewSpreadsheetDocument(jwt, {
    title: "Quan ly chi tieu",
  });
  newDoc.loadInfo();

  // copy template sheets vào file mới
  for (let i = 0; i < templateSheetsAmount; i++) {
    const z = await template.sheetsByIndex[i].copyToSpreadsheet(
      newDoc.spreadsheetId
    );
  }

  // rename sheet từ "bản sao của ..." -> "..."
  const duplicatedDoc = new GoogleSpreadsheet(newDoc.spreadsheetId, jwt);
  await duplicatedDoc.loadInfo();
  for (let i = 1; i < templateSheetsAmount + 1; i++) {
    const name = duplicatedDoc.sheetsByIndex[i].title.replace("Copy of ", "");
    duplicatedDoc.sheetsByIndex[i].updateProperties({ title: name });
  }

  //xoa sheet dau tien
  const sheet1 = duplicatedDoc.sheetsByIndex[0];
  await sheet1.delete();

  // share quyền cho user

  for (const mail of userMails) {
    await newDoc.share(mail);
  }
  const link = `https://docs.google.com/spreadsheets/d/${newDoc.spreadsheetId}`;
  return link;
};

const getTime = () => {
  var currentTime = new Date();
  var day = currentTime.getDate();
  var month = currentTime.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng 1
  var year = currentTime.getFullYear();

  // Định dạng ngày, tháng và năm thành chuỗi "dd/mm/yyyy"
  // var formattedDay = day < 10 ? "0" + day : day;
  var formattedDay = day;
  // var formattedMonth = month < 10 ? "0" + month : month;
  var formattedMonth = month;
  var formattedYear = year;

  // Lấy giờ, phút và giây từ đối tượng Date
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();

  // Định dạng lại chuỗi giờ, phút và giây thành "hh:mm:ss"
  var formattedTime =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  var formattedDate =
    formattedMonth +
    "/" +
    formattedDay +
    "/" +
    formattedYear +
    " " +
    formattedTime;
  return formattedDate;
};

const convertStringToNumber = (input) => {
  // Sử dụng regex để kiểm tra và bắt nhóm số và chữ cái cuối cùng
  const regex = /^(\d+(\.\d+)?)([kK]|[tT][rR])?$/;
  const segments = input.match(regex);

  if (segments) {
    let numberPart = parseFloat(segments[1]);
    let suffix = segments[3];

    if (suffix) {
      if (suffix.toLowerCase() === "k") {
        return numberPart * 1000;
      } else if (suffix.toLowerCase() === "tr") {
        return numberPart * 1000000;
      }
    }

    return numberPart;
  } else {
    return null;
  }
};

const writeGGSheet = async (
  mention,
  category,
  remainingData,
  sheetLink,
  writedUserEmail
) => {

  let money;
  let note = "";
  // Bước 2: Tách chuỗi thành hai phần dựa trên khoảng trắng đầu tiên

  const firstSpaceIndex = remainingData.indexOf(" ");
  if (firstSpaceIndex === -1) {
    money = convertStringToNumber(remainingData);
    note = "";
  } else {
    money = convertStringToNumber(remainingData.substring(0, firstSpaceIndex));
    note = remainingData.substring(firstSpaceIndex + 1);
  }

  // lấy sheetId
  let sheetId = "";
  const regex = /\/d\/([a-zA-Z0-9-_]+)(?:\/|$)/;
  const matches = sheetLink.match(regex);
  if (matches && matches[1]) {
    sheetId = matches[1];
  }

  // mở file sheet
  const file = new GoogleSpreadsheet(sheetId, jwt);
  await file.loadInfo();
  var sheet = file.sheetsByIndex[2];
  const timeDayMonthYear = getTime();

  const month = `Tháng ${new Date().getMonth() + 1}`;

  if (mention == "chi tiêu") {
    sheet = file.sheetsByIndex[1];
    await sheet

      .addRow({
        "Thời gian": timeDayMonthYear,
        "Hạng mục": category,
        "Số tiền": money,
        "Ghi chú": note,
        "Người ghi": writedUserEmail,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    // sheet = file.sheetsByIndex[3];
    // await sheet.loadCells("G6:AN6");
    // const remaining = sheet.getCellByA1("V6").value;
    // return remaining;
  } else if (mention == "lập kế hoạch") {
    console.log(timeDayMonthYear, category, money);
    await sheet
      .addRow({
        "Thời gian": timeDayMonthYear,
        "Hạng mục": category,
        [month]: money,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  } else if (mention == "thu nhập") {
    sheet = file.sheetsByIndex[3];
    await sheet
      .addRow({
        "Thời gian": timeDayMonthYear,
        "Loại thu nhập": category,
        "Số tiền": money,
        "Ghi chú": note,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  } else {
    return null;
  }
};





const readTotalSpending = async (sheetLink) => {
  // lấy sheetId
  let sheetId = "";
  const regex = /\/d\/([a-zA-Z0-9-_]+)(?:\/|$)/;
  const matches = sheetLink.match(regex);
  if (matches && matches[1]) {
    sheetId = matches[1];
  }

  // mở file sheet
  const file = new GoogleSpreadsheet(sheetId, jwt);
  await file.loadInfo();
  const sheet = file.sheetsByIndex[1];
  await sheet.loadCells("J2:L2");

  const day = sheet.getCellByA1("J2").value;
  const week = sheet.getCellByA1("K2").value;
  const month = sheet.getCellByA1("L2").value;
  return { day, week, month };
};


const readRemaining = async (sheetLink) => {
  // lấy sheetId
  let sheetId = "";
  const regex = /\/d\/([a-zA-Z0-9-_]+)(?:\/|$)/;
  const matches = sheetLink.match(regex);
  if (matches && matches[1]) {
    sheetId = matches[1];
  }

  // mở file sheet
  const file = new GoogleSpreadsheet(sheetId, jwt);
  await file.loadInfo();
  const sheet = file.sheetsByIndex[2];
  await sheet.loadCells("G6:AN6");

  let remaining = 0;
  const month = new Date().getMonth() + 1;
  if (month == 1) {
    remaining = sheet.getCellByA1("G6").value;
  }
  else if (month == 2) {
    remaining = sheet.getCellByA1("J6").value;
  }
  else if (month == 3) {
    remaining = sheet.getCellByA1("M6").value;
  }
  else if (month == 4) {
    remaining = sheet.getCellByA1("P6").value;
  }
  else if (month == 5) {
    remaining = sheet.getCellByA1("S6").value;
  }
  else if (month == 6) {
    remaining = sheet.getCellByA1("V6").value;
  }
  else if (month == 7) {
    remaining = sheet.getCellByA1("Y6").value;
  }
  else if (month == 8) {
    remaining = sheet.getCellByA1("AB6").value;
  }
  else if (month == 9) {
    remaining = sheet.getCellByA1("AE6").value;
  }
  else if (month == 10) {
    remaining = sheet.getCellByA1("AH6").value;
  }
  else if (month == 11) {
    remaining = sheet.getCellByA1("AK6").value;
  }
  else if (month == 12) {
    remaining = sheet.getCellByA1("AN6").value;
  }
  return remaining;
};
  


module.exports = {
  createNewSheet,
  createNewSheetForGroup,
  convertStringToNumber,
  writeGGSheet,
  readTotalSpending,
  readRemaining,
};
