const AdminModel = require('../models/admin.js');
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
});

// 압축 해제 함수 (adm-zip 사용)
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

exports.renderAdminPage = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);

        if (verified.class == 1){

            const proContent = await AdminModel.infoProblem();
            const repContent = await AdminModel.infoReport();
            const usrContent = await AdminModel.infoUser();
            const currentUser = await AdminModel.infoCurrentUser(verified.id);
            const flagLog = await AdminModel.infoFlagLog();
           
            const repCount = repContent.count;
            const report = repContent.report;

            const proCount = proContent.count;
            const problem = proContent.problem;
            
            const usrCount = usrContent.count;
            const user = usrContent.user;
            console.log(flagLog);
            console.log(verified.id,"| Controller | admin => renderAdminPage | Success");
            res.render("admin", { 'posts': {problem, proCount, currentUser, report, repCount, user, usrCount, flagLog} }); 
        } else {
            console.log(verified.id,"| Controller | admin => renderAdminPage | Fail");
            res.send(`<script>alert('Warning: You do not have permission to access this page'); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error("Controller | admin => renderAdminPage", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.proEditPageRender = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const proIdx = req.params.proIdx;

        if (verified.class == 1){

            const [editProContent] = await AdminModel.infoEditProblem(proIdx);
            console.log(editProContent);

            console.log(verified.id,"| Controller | admin => proEditPageRender | Success");
            res.render("proEdit", {'posts' : {editProContent}});  
        } else {
            console.log(verified.id,"| Controller | admin => proEditPageRender | Fail");
            res.send(`<script>alert('Warning: You do not have permission to access this page'); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error(verified.id,"| Controller | admin => proEditPageRender", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.deleteProblem = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const proIdx = req.params.proIdx;

        if (verified.class == 1){

            const [editProContent] = await AdminModel.infoEditProblem(proIdx);
            console.log(editProContent);

            console.log(verified.id,"| Controller | admin => deleteProblem | Success");
            res.render("proEdit", {'posts' : {editProContent}});  
        } else {
            console.log(verified.id,"| Controller | admin => deleteProblem | Fail");
            res.send(`<script>alert('Warning: You do not have permission to access this page'); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error(verified.id,"| Controller | admin => deleteProblem", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.editProblem = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const { title, text, category, flag, port, score } = req.body;
        const proIdx = req.params.proIdx;

        if (verified.class == 1){

            console.log(req.body);
            console.log(req.files);

            if (req.files) { // 파일이 존재할 때
                console.log("file exist");

                if (req.files.serverFile){ // 서버 파일 존재할 때
                    // 도커 새로 빌드
                    if (req.body.category == "Web" || req.body.category == "Pwn") {
                        // serverFile zip 파일 압축 해제
                        const outputDir = path.join(__dirname, '../workspace', req.files.serverFile[0].originalname);
                        await extractZipFile(req.files.serverFile[0].path, outputDir); //압축해제
            
                        console.log("success unzip");
            
                        // docker-compose 파일 빌드
                        await runDocker(outputDir);
            
                        console.log("success build");
                    }
                }
                
                await AdminModel.editProblemNotFile({proIdx, title, text, category, flag, score, port});

                if (req.files.releaseFile){ // 릴리즈 파일 존재할 때
                    const releaseFileName = req.files.releaseFile[0].originalname;
                    await AdminModel.editProblem({proIdx, title, text, category, flag, score, port, releaseFileName});
                } 
                
            } else {
                await AdminModel.editProblemNotFile({proIdx, title, text, category, flag, score, port});
            }

            console.log(verified.id,"| Controller | admin => editProblem | Success");
            res.send(`<script>alert('Upload Success'); window.location.href = '/admin';</script>`);
      
        } else {
            console.log(verified.id,"| Controller | admin => editProblem | Fail");
            res.send(`<script>alert('Warning: You do not have permission to access this page'); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error("| Controller | admin => editProblem", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/admin';</script>`);
    }

};

exports.deleteProblem = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const proIdx = req.params.proIdx;

        if (verified.class == 1){

            await AdminModel.deleteProblem(proIdx);

            console.log(verified.id,"| Controller | admin => deleteProblem | Success");
            res.send(`<script>alert('Delete Success'); window.location.href = '/admin';</script>`);
        } else {
            console.log(verified.id,"| Controller | admin => deleteProblem | Fail");
            res.send(`<script>alert('Warning: You do not have permission to access this page'); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error("| Controller | admin => deleteProblem", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.banUser = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const usrIdx = req.params.usrIdx;

        if (verified.class == 1){
            console.log(usrIdx);
            await AdminModel.banUser(usrIdx);

            console.log(verified.id,"| Controller | admin => banUser | Success");
            res.send(`<script>alert('Ban Success'); window.location.href = '/admin';</script>`);
        } else {
            console.log(verified.id,"| Controller | admin => banUser | Fail");
            res.send(`<script>alert('Warning: You do not have permission to access this page'); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error("| Controller | admin => banUser", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};

exports.checkReport = async (req, res) => {

    try {
        const token = req.cookies.session;
        const verified = jwt.verify(token, SECRET_key);
        const repIdx = req.params.repIdx;

        if (verified.class == 1){

            await AdminModel.checkReport(repIdx);

            console.log(verified.id,"| Controller | admin => checkReport | Success");
            res.send(`<script>alert('Check Success'); window.location.href = '/admin';</script>`);
        } else {
            console.log(verified.id,"| Controller | admin => checkReport | Fail");
            res.send(`<script>alert('Warning: You do not have permission to access this page'); window.location.href = '/';</script>`);
        }

    } catch (error) {
        console.error("| Controller | admin => checkReports", error);  
        return res.send(`<script>alert("Warning: Invalid Token"); window.location.href = '/';</script>`);
    }

};


exports.uploadMiddleware = upload.fields([
    { name: 'releaseFile', maxCount: 1 },
    { name: 'serverFile', maxCount: 1 }  
]);


