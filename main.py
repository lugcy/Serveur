from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def accueil():
    return 'Bienvenu sur ma page html!'

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
    uvicorn.run(app, host='192.168.1.98', port=1000)

