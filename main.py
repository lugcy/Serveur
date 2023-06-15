from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI()
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

@app.get('/style.css')
def getCSS(request : Request):
    return templates.TemplateResponse("style.css", {"request": request})

@app.get('/script.js')
def getCSS(request : Request):
    return templates.TemplateResponse("script.js", {"request": request})

@app.get('/getNbrPosts')
def getNbrPosts():
    return {'nbrPosts':5}

@app.get('/getImg/{name}')
def getImg(name):
    path = name.split('.')
    extension = path[-1]
    path = 'Ressources/' + '.'.join(path)
    return FileResponse(path, media_type=extension)

if __name__ == '__main__':
    uvicorn.run(app, host='192.168.1.31', port=1000)

