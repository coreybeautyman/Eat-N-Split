import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import './App.css';

const friendsObj = [
  {
    name: 'David',
    img: '/img/1-intro-photo-final.jpg',
    id: 1,
    moneyOwed: 0
  },
  {
    name: 'Paul',
    img: '/img/360_F_423597477_AKCjGMtevfCi9XJG0M8jter97kG466y7.jpg',
    id: 2,
    moneyOwed: 20
  },
  {
    name: 'Ben',
    img: '/img/social-media-profile-photos-3.jpg',
    id: 3,
    moneyOwed: 0
  },
  {
    name: 'Sam',
    img: '/img/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg',
    id: 4,
    moneyOwed: 0
  }
  // {
  //   name: 'Sam',
  //   img: '/img/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg',
  //   id: 5,
  //   moneyOwed: 0
  // },
  // {
  //   name: 'Sam',
  //   img: '/img/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg',
  //   id: 6,
  //   moneyOwed: 0
  // }
];

function App() {
  const [selected, setSelected] = useState(null);
  const [friends, setFriends] = useState(friendsObj);
  const [billValue, setBillValue] = useState('');
  const [yourExpense, setYourExpense] = useState('');
  const [selectPaying, setSelectPaying] = useState('Me');
  const [modalOpen, setModalOpen] = useState(false);

  const selectedFriend = friends?.filter((f) => f.id === selected)[0];

  function resetValues() {
    setBillValue('');
    setYourExpense('');
    setSelectPaying('Me');
  }

  return (
    <div className='app'>
      <SelectFriends
        selected={selected}
        setSelected={setSelected}
        friends={friends}
        setBillValue={setBillValue}
        resetValues={resetValues}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      ></SelectFriends>
      <SplitBill
        friends={friends}
        setFriends={setFriends}
        setBillValue={setBillValue}
        selected={selected}
        selectedFriend={selectedFriend}
        billValue={billValue}
        resetValues={resetValues}
        yourExpense={yourExpense}
        setYourExpense={setYourExpense}
        selectPaying={selectPaying}
        setSelectPaying={setSelectPaying}
      ></SplitBill>

      <AddFriendModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        friends={friends}
        setFriends={setFriends}
      />
    </div>
  );
}

function AddFriendModal({ modalOpen, setModalOpen, friends, setFriends }) {
  function handleSubmit(values, { resetForm }) {
    const newFriend = {
      name: values.name,
      img: values.img,
      id: Date.now(),
      moneyOwed: 0
    };

    setFriends([...friends, newFriend]);
    resetForm();
    setModalOpen(false);
  }

  return (
    <>
      <div
        className={`backgroundblur ${modalOpen ? '' : 'hidden'}`}
        onClick={() => setModalOpen(false)}
      ></div>
      <div className={`modal ${modalOpen ? '' : 'hidden'}`}>
        <button className='modalBtnClose' onClick={() => setModalOpen(false)}>
          ❌
        </button>
        <div className='modalTitle'>
          <h1>Add friend</h1>
        </div>

        <Formik initialValues={{ name: '', img: '' }} onSubmit={handleSubmit}>
          <Form className='forn'>
            <div className='nameInputDiv'>
              <h2>Friend name:</h2>
              <Field name='name' className='input'></Field>
            </div>
            <div className='imgInputDiv'>
              <h2>Image URL:</h2>
              <Field name='img' className='input'></Field>
            </div>
            <div className='modalBtnDiv'>
              <button type='submit' className='btn modalBtn'>
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </>
  );
}
function SelectFriends({
  selected,
  setSelected,
  friends,
  resetValues,
  modalOpen,
  setModalOpen
}) {
  return (
    <>
      <div className='friendsCont'>
        {friends.map((f) => (
          <Friend
            key={f.id}
            friend={f}
            selected={selected}
            setSelected={setSelected}
            resetValues={resetValues}
          ></Friend>
        ))}
      </div>
      <div className='addFriendsBtnCont'>
        <button
          className='btn addFriendBtn'
          onClick={() => {
            console.log('open');
            setModalOpen(true);
          }}
        >
          Add Friend
        </button>
      </div>
    </>
  );
}

function Friend({ friend, selected, setSelected, resetValues }) {
  const { id, name, img, moneyOwed } = friend;

  function onSelectedFriend(id) {
    id !== selected ? setSelected(id) : setSelected(null);
  }

  return (
    <div className={`friend ${selected === id ? 'active' : ''}`}>
      <div className='imgCont'>
        <img className='img' src={img} alt={name}></img>
      </div>
      <div className='infoCont'>
        <h2 className='name'>{name}</h2>
        <p className='para'>
          {moneyOwed < 0
            ? `You owe ${name} £${Math.abs(moneyOwed)}`
            : moneyOwed > 0
            ? `${name} owes you £${moneyOwed}`
            : `You and ${name} are even`}
        </p>
      </div>
      <div className='btnCont'>
        <button
          onClick={() => {
            resetValues();
            onSelectedFriend(id);
          }}
          className='btn'
        >
          {selected === id ? 'Unselect' : 'Select'}
        </button>
      </div>
    </div>
  );
}

function SplitBill({
  friends,
  setFriends,
  selected,
  selectedFriend = '',
  billValue,
  setBillValue,
  yourExpense,
  setYourExpense,
  resetValues,
  selectPaying,
  setSelectPaying
}) {
  const friendsExpense = billValue - yourExpense;

  function setMoneyOwed() {
    let owedMoney;

    if (selectPaying === 'Me') {
      owedMoney = friendsExpense;
    }
    if (selectPaying !== 'Me') {
      owedMoney = yourExpense * -1;
    }

    setFriends(
      friends.map((f) =>
        f.id === selected ? { ...f, moneyOwed: f.moneyOwed + owedMoney } : f
      )
    );
  }

  function setExpense(input) {
    return setYourExpense(+input < +billValue ? +input : +billValue);
  }

  function resetBillExpense() {
    setBillValue('');
    setYourExpense('');
  }

  return selected ? (
    <>
      {' '}
      <div className='splitBill'>
        <h1 className='sbTitle'>Split bill with {selectedFriend.name}</h1>
        <ul className='list'>
          <div className='listItem'>
            <p className='sbPara'>💰 Bill value</p>
            <input
              value={billValue}
              onChange={(e) => setBillValue(e.target.value)}
              type='number'
              className='input'
            ></input>
          </div>
          <div className='listItem'>
            <p className='sbPara'>🧍‍♂️ Your expence</p>
            <input
              value={yourExpense}
              onChange={(e) => setExpense(e.target.value)}
              className='input'
            ></input>
          </div>
          <div className='listItem'>
            <p className='sbPara'>👯 {selectedFriend.name} expense</p>
            <input value={friendsExpense} disabled className='input'></input>
          </div>
          <div className='listItem'>
            <p className='sbPara'>🤑 Who is paying the bill?</p>
            <select
              onChange={(e) => {
                setSelectPaying(e.target.value);
              }}
              className='select'
              value={selectPaying}
            >
              <option>Me</option>
              <option>{selectedFriend.name}</option>
            </select>
          </div>
        </ul>
      </div>
      <div className='sbBtnCont'>
        <button
          className='btn'
          onClick={() => {
            setMoneyOwed();
            resetBillExpense();
          }}
        >
          Split bill
        </button>
      </div>
    </>
  ) : (
    <div className='splitBill hide'></div>
  );
}

export default App;
