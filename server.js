import express from 'express'
import cors from 'cors';
import fs from 'fs'
import csv from 'csvtojson';
import { parse } from 'json2csv';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path'
import moment from 'moment'
const publicFolder = 'public'
const mergedFolder = `${publicFolder}/merged`
const desktopMergedFolder = `${publicFolder}/merged/desktop`
const mobileMergedFolder = `${publicFolder}/merged/mobile`

const app = express()
const port = 3000

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + '_' + time;

const __dirname = path.resolve(path.dirname(''));

app.use(cors())
app.use(
  express.static(publicFolder, {
    setHeaders(res) {
      res.setHeader('Cache-Control', 'public, max-age=315360000');
    },
  })
);

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, '/index.html'));
})

const mergeFiles = async () => {
  const file1 = 'graph/desktop-2022-02-02--23-32/results-median-desktop-2022-02-02--23-32.csv';
  const file2 = 'graph/desktop-2022-02-03--21-52/results-median-desktop-2022-02-03--21-52.csv';
  const file3 = 'graph/desktop-2022-02-10--11-14/results-median-desktop-2022-02-10--11-14.csv';

  const list1 = await csv().fromFile(file1);
  const list2 = await csv().fromFile(file2);
  const list3 = await csv().fromFile(file3);

  const desktopList = list1.concat(list2).concat(list3)

  //
  const desktopUrlMaps = {}

  desktopList.forEach(item => {
    if (!desktopUrlMaps.hasOwnProperty(item.testUrl)) {
      desktopUrlMaps[item.testUrl] = []
    }
    let timestamp = moment(item.date, "YYYY-MM-DD hh:mm:ss").format("x")
    desktopUrlMaps[item.testUrl].push([parseInt(timestamp), 100 * Math.round(item.PerformanceScore * 100) / 100])
  })
  // console.log('final', JSON.stringify(desktopUrlMaps))

  // 

  writeFile(`./${desktopMergedFolder}/desktop.csv`, parse(desktopList)).catch((err) =>
    console.log(`Error writing desktop file:${err}`)
  );

  const file4 = 'graph/mobile-2022-02-02--23-24/results-median-mobile-2022-02-02--23-24.csv';
  const file5 = 'graph/mobile-2022-02-03--21-44/results-median-mobile-2022-02-03--21-44.csv';
  const file6 = 'graph/mobile-2022-02-10--10-24/results-median-mobile-2022-02-10--10-24.csv';

  const list4 = await csv().fromFile(file4);
  const list5 = await csv().fromFile(file5);
  const list6 = await csv().fromFile(file6);

  const mobileList = list4.concat(list5).concat(list6)

  //
  // console.log(JSON.stringify(mobileList[0]))
  // console.log(JSON.stringify(mobileList[1]))

  const mobileUrlMaps = {}

  mobileList.forEach(item => {
    if (!mobileUrlMaps.hasOwnProperty(item.testUrl)) {
      mobileUrlMaps[item.testUrl] = []
    }
    let timestamp = moment(item.date, "YYYY-MM-DD hh:mm:ss").format("x")
    mobileUrlMaps[item.testUrl].push([parseInt(timestamp), 100 * Math.round(item.PerformanceScore * 100) / 100])
  })
  // console.log('final2', JSON.stringify(mobileUrlMaps))

  // 

  fs.writeFile(`${mergedFolder}/performance.json`, JSON.stringify({ desktop: desktopUrlMaps, mobile: mobileUrlMaps }), function (err) {
    if (err) throw err;
    console.log('complete');
  }
  );

  writeFile(`./${mobileMergedFolder}/mobile.csv`, parse(mobileList)).catch((err) =>
    console.log(`Error writing mobile file:${err}`)
  );
}

app.listen(port, () => {
  fs.rmSync(mergedFolder, { recursive: true, force: true });
  fs.mkdirSync(mergedFolder, { recursive: true });
  fs.mkdirSync(desktopMergedFolder, { recursive: true });
  fs.mkdirSync(mobileMergedFolder, { recursive: true });

  mergeFiles()

  console.log(`Example app listening on port ${port} ${dateTime}`)
})