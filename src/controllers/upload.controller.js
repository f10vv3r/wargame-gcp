const UploadModel = require('../models/upload.js');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path'); 
const AdmZip = require('adm-zip'); 
const fs = require('fs');
const { spawn } = require('child_process');

const SECRET_key = process.env.SECRET_key;

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, "../upload"); 
      },

      filename(req, file, done) {
        const ext = path.extname(file.originalname);

        if (ext !== '.zip') {
            return done(new Error('Only zip files are allowed.'));
        }

        done(null, path.basename(file.originalname, ext) + ext);
      },
    }),
    limits: {
        fileSize: 10000 * 1024 * 1024, // 10GB
    },
});

// 압축 해제 함수
async function extractZipFile(zipPath, outputDir) {
    return new Promise((resolve, reject) => {
        try {
            const zip = new AdmZip(zipPath);  // 압축 파일 열기
            zip.extractAllTo(outputDir, true);  // 지정된 디렉토리에 압축 해제

            console.log(`Extraction complete. Files are extracted to ${outputDir}`);
            resolve();  // 압축 해제 완료 후 resolve
        } catch (error) {
            reject(error);  // 에러 발생 시 reject
        }
    });
}

// 도커 빌드 함수
async function runDocker(serverFilePath) {
    const dockerComposePath = path.join(serverFilePath, 'docker-compose.yml');
    if (!fs.existsSync(dockerComposePath)) {
        throw new Error('docker-compose.yml 파일이 없습니다.');
    }

    return new Promise((resolve, reject) => {
        const dockerCompose = spawn('docker-compose', ['-f', dockerComposePath, 'up', '--build']);

        dockerCompose.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);

            resolve();

        });

        dockerCompose.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    });
}


exports.renderUploadPage = (req, res) => {
    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        console.log(verified.class);

        if (verified.class === 1){
            res.render("upload");
        } else {
            return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error("JWT verification failed:", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }
};

exports.handleUpload = async (req, res) => {
    const { title, text, category, flag, port, score } = req.body;
    const releaseFileName = req.files.releaseFile[0].originalname;
    

    console.log(req.body); 
    console.log(req.files); 

    try {

        // JWT 인증
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);

        const usrIdx = await UploadModel.whatUsrIdx(verified.id);
        await UploadModel.uploadProblem({ usrIdx, title, text, category, flag, score, port, releaseFileName });

        if (req.body.category == "Web" || req.body.category == "Pwn") {
            const serverFile = req.files.serverFile[0];
            // serverFile zip 파일 압축 해제
            const outputDir = path.join(__dirname, '../workspace', serverFile.originalname);
            await extractZipFile(serverFile.path, outputDir); //압축해제

            console.log("success unzip");

            // docker-compose 파일 빌드
            await runDocker(outputDir);

            console.log("success build");
        }

        res.send(`<script>alert("upload success"); window.location.href = '/wargame';</script>`);
    } catch (error) {
        console.error("Problem Upload Fail:", error);
        return res.send(`<script>alert("Problem upload Fail. Please try again."); window.location.href = '/';</script>`);
    }
};

exports.uploadMiddleware = upload.fields([
    { name: 'releaseFile', maxCount: 1 },
    { name: 'serverFile', maxCount: 1 }  
]);
