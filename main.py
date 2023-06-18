from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import uvicorn
import json

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/Ressources", StaticFiles(directory="Ressources"), name="Ressources");

templates = Jinja2Templates(directory="")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get('/')
def accueil(request : Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get('/static/style.css')
def getCSS(request : Request):
    return templates.TemplateResponse("static/style.css", {"request": request})

@app.get('/static/script.js')
def getCSS(request : Request):
    return templates.TemplateResponse("static/script.js", {"request": request})

@app.get('/getNbrPosts')
def getNbrPosts():
    data = open('Ressources/file.json', 'r') .readlines()
    return {'nbrPosts':len(data)}

@app.get('/Ressources/{name}')
def getImg(name, request : Request):
    path = 'Ressources/' + name
    return templates.TemplateResponse(path, {"request": request})

@app.get('/src_img/{id}')
def getSrcImg(id):
    data = open('Ressources/file.json', 'r').readlines()
    for i in data:
        i = json.loads(i)
        if i['id'] == int(id):
            return i['src']

if __name__ == '__main__':
    uvicorn.run(app, host='192.168.1.31', port=1001)

