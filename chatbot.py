import os
import pandas as pd
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Tuple, Dict
import sys

sys.stdout.reconfigure(encoding='utf-8')

QUESTION_FORMAT_START = 'Câu hỏi:'
ANSWER_FORMAT_START = 'Câu trả lời:'

# Hàm đọc file từ thư mục cục bộ
def fetch_files_from_local(directory: str) -> List[str]:
    qa_pairs = []
    if not os.path.exists(directory):
        os.makedirs(directory)
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.txt', '.docx')):
            file_path = os.path.join(directory, filename)
            if file_path.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    lines = content.split('\n')
                    question = None
                    for line in lines:
                        line = line.strip()
                        if line.startswith(QUESTION_FORMAT_START):
                            if question:
                                qa_pairs.append((question, ""))
                            question = line.replace(QUESTION_FORMAT_START, '').strip()
                        elif line.startswith(ANSWER_FORMAT_START) and question:
                            answer = line.replace(ANSWER_FORMAT_START, '').strip()
                            qa_pairs.append((question, answer))
                            question = None
                    if question:
                        qa_pairs.append((question, ""))
                    for line in content.split('\n'):
                        if '|||' in line:
                            parts = [p.strip() for p in line.split('|||')]
                            if len(parts) == 2:
                                qa_pairs.append((parts[0], parts[1]))
            elif file_path.endswith('.docx'):
                try:
                    from docx import Document
                    doc = Document(file_path)
                    full_text = ""
                    for para in doc.paragraphs:
                        text = para.text.strip()
                        if text:
                            full_text += text + "\n"
                    lines = full_text.split('\n')
                    question = None
                    for line in lines:
                        line = line.strip()
                        if line.startswith(QUESTION_FORMAT_START):
                            if question:
                                qa_pairs.append((question, ""))
                            question = line.replace(QUESTION_FORMAT_START, '').strip()
                        elif line.startswith(ANSWER_FORMAT_START) and question:
                            answer = line.replace(ANSWER_FORMAT_START, '').strip()
                            qa_pairs.append((question, answer))
                            question = None
                    if question:
                        qa_pairs.append((question, ""))
                    for line in full_text.split('\n'):
                        if '|||' in line:
                            parts = [p.strip() for p in line.split('|||')]
                            if len(parts) == 2:
                                qa_pairs.append((parts[0], parts[1]))
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
    return qa_pairs

# Hàm xây dựng index cho tìm kiếm
def build_faiss_index(questions: List[str], model: SentenceTransformer) -> Tuple[faiss.IndexFlatL2, np.ndarray, Dict[int, str]]:
    embeddings = model.encode(questions, convert_to_numpy=True)
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index, embeddings, {i: answer for i, (_, answer) in enumerate(qa_pairs)}

# Hàm tìm kiếm câu trả lời
def retrieve_answer(user_question: str, model: SentenceTransformer, index: faiss.IndexFlatL2, qa_map: Dict[int, str], top_k: int = 1) -> str:
    user_embedding = model.encode([user_question], convert_to_numpy=True)
    _distances, indices = index.search(user_embedding, top_k)
    
    best_idx = indices[0][0]
    if best_idx in qa_map:
        answer = qa_map[best_idx]
        if answer:
            return answer
    return "Không tìm thấy câu trả lời phù hợp."

# Hàm chính
def main():
    local_directory = './uploaded_documents'
    global qa_pairs
    qa_pairs = fetch_files_from_local(local_directory)
    
    if not qa_pairs:
        print("No valid data extracted from files.", file=sys.stderr)
        sys.exit(1)
    
    questions = [q for q, _ in qa_pairs]
    _answers = [a for _, a in qa_pairs]
    qa_map = {i: a for i, (_, a) in enumerate(qa_pairs)}
    
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    index, _, _ = build_faiss_index(questions, model)
    
    if len(sys.argv) > 1:
        question = sys.argv[1]
        answer = retrieve_answer(question, model, index, qa_map)
        try:
            print(answer.encode('utf-8').decode('utf-8'))  # Ép in với UTF-8
        except UnicodeEncodeError as e:
            print("Error encoding answer:", e, file=sys.stderr)
    else:
        print(sys.argv)
        print("No question provided.", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()