import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, getDocs } from 'firebase/firestore';
import styled from 'styled-components';

import FileUpload from './FileUpload';
import TodoItem from './TodoItem';

function InputForm() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);

      const initialTodos = [];

      querySnapshot.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data()
        };
        initialTodos.push(data);
      });
      setTodos(initialTodos);
    };
    fetchData();
  }, []);

  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    if (name === 'text') {
      setText(value);
    }
  };

  const addTodo = async (event) => {
    event.preventDefault();
    const newTodo = { text: text, imageUrl: imageUrl, isDone: false };
    setTodos((prev) => {
      return [...todos, newTodo];
    });
    setText('');

    const collectionRef = collection(db, 'users');
    await addDoc(collectionRef, newTodo);
  };

  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  return (
    <div>
      <Tit>회원님의 소중한 이야기를 적어주세요.</Tit>
      <InputFormContainer>
        <InputBody>
          <TagI>
            <TextareaT
              type="text"
              placeholder="제목을 입력해 주세요."
              value={text}
              name="text"
              onChange={onChange}
              required
            />
          </TagI>
          <TagTab>
            <FileUpload onImageUpload={handleImageUpload} />
            <RegisterBtn onClick={addTodo}>추가</RegisterBtn>
          </TagTab>
        </InputBody>
      </InputFormContainer>
      {todos
        .filter((todo) => !todo.isDone)
        .map((todo) => {
          return <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />;
        })}
    </div>
  );
}

export default InputForm;

const Tit = styled.h2`
  display: flex;
  justify-content: center;
  margin: 100px 0 60px;
  font-size: 2rem;
`;

const InputFormContainer = styled.form`
  width: 100%;
  margin: 0 auto;
  margin-top: 10px;
`;

const InputBody = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-top: 10px;
`;

const TagI = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-top: 20px;
`;

const TagTab = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  margin-top: 20px;
`;

const TextareaT = styled.input`
  width: 730px;
  height: 30px;
  border: 4px solid #eb9307;
  border-radius: 16px;
  margin-top: 10px;
  font-size: 20px;
  padding: 10px;
  box-shadow: 10px 5px 20px gray;
`;

const RegisterBtn = styled.button`
  width: 120px;
  height: 56px;
  margin: 0 20px;
  border-radius: 14px;
  border: none;
  background-color: #eb9307;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 10px 5px 20px gray;
  &:hover {
    cursor: pointer;
    background-color: #ff8f05;
    color: black;
  }
`;
