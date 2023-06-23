from fastapi import FastAPI, Request, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import uvicorn
import json, shutil, os


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/Ressources", StaticFiles(directory="Ressources"), name="Ressources")

templates = Jinja2Templates(directory="")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def setId(i=0):
    a = getIds()['listId']
    if i not in a:
        return i
    return setId(i+1)


@app.get('/')
def accueil(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get('/static/style.css')
def getCSS(request: Request):
    return templates.TemplateResponse("static/style.css", {"request": request})

@app.get('/static/script.js')
def getCSS(request: Request):
    return templates.TemplateResponse("static/script.js", {"request": request})

@app.get('/getNbrPosts')
def getNbrPosts():
    data = open('Ressources/file.json', 'r') .readlines()
    i = 0
    for i in data:
        if i == '\n':
            i-=1
    return {'nbrPosts': i}

@app.get('/getIds')
def getIds():
    data = open('Ressources/file.json', 'r').readlines()
    ids = []
    for i in data:
        if i!='\n':
            i = json.loads(i)
            ids.append(i['id'])
    return {'listId': ids}


@app.get('/Ressources/{name}')
def getImg(name, request: Request):
    path = 'Ressources/' + name
    return templates.TemplateResponse(path, {"request": request})

@app.get('/src_img/{id}')
def getSrcImg(id):
    data = open('Ressources/file.json', 'r').readlines()
    for i in data:
        i = json.loads(i)
        if i['id'] == int(id):
            return i['src']

@app.post('/upload')
async def upload_file(file: UploadFile):
    destination_path = "Ressources/img/" + file.filename

    with open(destination_path, "wb") as destination:
        shutil.copyfileobj(file.file, destination)

    msgFile = {"id": setId(0), "src": file.filename}
    with open('Ressources/file.json', 'a') as jsonFile:
        json.dump(msgFile, jsonFile)
        jsonFile.write('\n')

    return {"message": "Fichier téléchargé avec succès"}

@app.delete('/cancelUpload')
async def cancel_upload():
    nbr = getNbrPosts()['nbrPosts']-1
    path = 'Ressources/img/' + getSrcImg(nbr)
    if os.path.exists(path):
        os.remove(path)

        data = open('Ressources/file.json', 'r').readlines()
        del data[nbr]
        open('Ressources/file.json', 'w')
        with open('Ressources/file.json', 'a') as newJsonFile:
            for i in data:
                newJsonFile.write(i)

        return {"message": "Fichier bien enlevé"}
    else:
        return {"message": "Fichier introuvable"}

if __name__ == '__main__':
    uvicorn.run(app, host='192.168.1.31', port=1001)

