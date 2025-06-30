from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Tuple, Dict
from sentence_transformers import SentenceTransformer
import uvicorn
import faiss
import numpy as np
import os
import sys
from docx import Document
from contextlib import asynccontextmanager

# ==== Cấu hình chung ====
QUESTION_FORMAT_START = 'Câu hỏi:'
ANSWER_FORMAT_START = 'Câu trả lời:'
UPLOAD_DIR = '../tmp/uploaded_documents'

qa_pairs: List[Tuple[str, str]] = []
qa_map: Dict[int, str] = {}
index = None
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# ==== Model input ====
class QuestionRequest(BaseModel):
    question: str

# ==== Tách file QA từ thư mục ====
def fetch_files_from_local(directory: str) -> List[Tuple[str, str]]:
    pairs = []
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"[⚠️] Thư mục {directory} không tồn tại, đã tạo mới")

    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)

        if not os.path.isfile(file_path):
            continue

        try:
            if file_path.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    pairs += extract_qa_from_text(content)
            elif file_path.endswith('.docx'):
                doc = Document(file_path)
                content = "\n".join(para.text.strip() for para in doc.paragraphs if para.text.strip())
                pairs += extract_qa_from_text(content)
            else:
                print(f"[⏭️] Bỏ qua file không hỗ trợ: {filename}")
        except Exception as e:
            print(f"[❌] Lỗi xử lý file {filename}: {e}", file=sys.stderr)

    return pairs

# ==== Parse Q-A từ nội dung text ====
def extract_qa_from_text(text: str) -> List[Tuple[str, str]]:
    lines = text.split('\n')
    pairs = []
    question = None

    for line in lines:
        line = line.strip()
        if line.startswith(QUESTION_FORMAT_START):
            if question:
                pairs.append((question, ""))
            question = line.replace(QUESTION_FORMAT_START, '').strip()
        elif line.startswith(ANSWER_FORMAT_START) and question:
            answer = line.replace(ANSWER_FORMAT_START, '').strip()
            pairs.append((question, answer))
            question = None

    if question:
        pairs.append((question, ""))

    for line in text.split('\n'):
        if '|||' in line:
            parts = [p.strip() for p in line.split('|||')]
            if len(parts) == 2:
                pairs.append((parts[0], parts[1]))

    return pairs

# ==== FAISS Index ====
def build_faiss_index(questions: List[str]) -> Tuple[faiss.IndexFlatL2, Dict[int, str]]:
    embeddings = model.encode(questions, convert_to_numpy=True)
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    qamap = {i: a for i, (_, a) in enumerate(qa_pairs)}
    return index, qamap

# ==== Lifespan init ====
@asynccontextmanager
async def lifespan(app: FastAPI):
    global qa_pairs, index, qa_map
    print("[🔁] Đang load dữ liệu...")
    qa_pairs = fetch_files_from_local(UPLOAD_DIR)
    if not qa_pairs:
        print("[⚠️] Không có dữ liệu hợp lệ trong thư mục upload", file=sys.stderr)
    else:
        print(f"[✅] Đã load {len(qa_pairs)} câu hỏi")
        questions = [q for q, _ in qa_pairs]
        index, qa_map = build_faiss_index(questions)
        print("[📌] FAISS index đã sẵn sàng")
    yield

app = FastAPI(lifespan=lifespan)

# ==== API Chat ====
@app.post("/services/api/chat")
def chat_with_bot(data: QuestionRequest):
    if not index or not qa_map:
        return {"answer": "Không có dữ liệu để trả lời."}

    question = data.question
    embedding = model.encode([question], convert_to_numpy=True)
    _, indices = index.search(embedding, 1)

    best_idx = indices[0][0]
    answer = qa_map.get(best_idx, "Không tìm thấy câu trả lời phù hợp.")
    return {"answer": answer}

# ==== Chạy local server ====
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
