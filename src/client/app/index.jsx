import React, { Component } from 'react';
import {render} from 'react-dom';

// Add items (i.e. _Strawberries_) and associated quantities (i.e. _3_) to a shopping list
// Mark items as 'in the basket'
// Clear 'in the basket' items from the list

const Item = (props) => {
	return (
		props.list.map((list, index) => {
            return  <li className="bsk-item" key={index}>
				    	<div className="bsk-remove-item button" onClick={() => props.removeItem(index)}>x</div>
				    	<div className="bsk-amount">{list.amount}</div>
				    	<div className="bsk-item-name">{list.name}</div>
				    	{props.users > 0 && props.currlistIndex == index &&
				    		<div className="bsk-add-user button assign-here float-right" onClick={() => props.assignUser(index)}>Add user</div>
				    	}
				    	{props.users > 0 && props.currlistIndex != index &&
				    		<div className="bsk-add-user button float-right" onClick={() => props.assignUser(index)}>Add user</div>
				    	}
				    	<div className="bsk-remove-add-to-basket button float-right" onClick={() => props.addBasket(index)}>Basket It!</div>
				    	{list.user &&
				    		<div className="bsk-assigned-user">
				    			<div>Assigned To: {list.user}</div>
				    			<div className="bsk-remove-assigned button float-right" onClick={() => props.removeAssigned(index, 'list')}>x</div>
				    		</div>
				    	}
				    </li>

        })
	)
}

const EmptyItem = (props) => {
	return (
	    <li className="bsk-add">
	    	<div className="bsk-item-input">Item: <input value={props.itemName} onChange={(e) => props.listenToInput(e, 'itemName')} type="text" size="15" /></div>
	    	<div className="bsk-amount-input">Qty: <input value={props.itemAmount} onChange={(e) => props.listenToInput(e, 'itemAmount')} type="text" size="3" /></div>
	    	<div className="bsk-add-item button float-right" onClick={() => props.addItem()}>Add Item</div>
	    </li>
	)
}

const User = (props) => {
	return (
		props.users.map((users, index) => {
            return  <li className="bsk-user" key={index}>
				    	<div className="bsk-remove-item button" onClick={() => props.removeUser(index)}>x</div>
				    	<div className="bsk-user-name">{users.name}</div>
				    	{props.assginUser &&
				    		<div className="bsk-add-user button float-right" onClick={() => props.connectUser(users.name)}>Assign user</div>
				    	}
				    </li>

        })
	)
}

const EmptyUser = (props) => {
	return (
	    <li className="bsk-add">
	    	<div className="bsk-item-input"><input value={props.user} onChange={(e) => props.listenToInput(e, 'user')} type="text" size="20" /></div>
	    	<div className="bsk-add-item button float-right" onClick={() => props.addUser()}>Add User</div>
	    </li>
	)
}

const BasketItem = (props) => {
	return (
		props.inBasket.map((inBasket, index) => {
            return  <li className="bsk-item" key={index}>
				    	<div className="bsk-remove-item button" onClick={() => props.removeBasketItem(index)}>x</div>
				    	<div className="bsk-amount">{inBasket.amount}</div>
				    	<div className="bsk-item-name">{inBasket.name}</div>
				    	{inBasket.user &&
				    		<div className="bsk-assigned-user"><div>Assigned To: {inBasket.user}</div><div className="bsk-remove-assigned button float-right" onClick={() => props.removeAssigned(index, 'inBasket')}>x</div></div>
				    	}
				    </li>

        })
	)
}

class App extends React.Component{
	constructor() {
    	super();
	    this.state = {
	    	list:[],
	    	inBasket:[],
	    	users:[],
	    	itemName: '',
	    	itemAmount: '',
	    	user: '',
	    	error: '',
	    	listIndex: -1,
	    	assginUser: false
	    };
	}
	listenToInput(e, name) {
		this.setState({ [name]: e.target.value });
	}
	addItem() {
		let iName = this.state.itemName;
		let iAmnt = this.state.itemAmount;
		if(iName.trim() == '' || iAmnt.trim() == '' || isNaN(Number(iAmnt))){
			if(iName.trim() == ''){
				this.setState({error: 'Please add an item'});
			}else if(iAmnt.trim() == ''){
				this.setState({error: 'Please add an amount'});
			}else if(isNaN(parseInt(iAmnt, 100))){
				this.setState({error: 'Please only use numbers in the amount field'});
			}
		}else{
			let addToArray = this.state.list;
		    addToArray.push({name:this.state.itemName, amount:this.state.itemAmount});
		    this.setState({itemName: '', itemAmount: ''});
		    this.setState({error: ''});
		}
		
	}
	removeItem(thisKey) {
		let removeFromArray = this.state.list.slice();
	    let removed = removeFromArray.splice(thisKey, 1);
	    this.setState({list: removeFromArray});
	}
	addBasket(thisKey){
		let removeFromArray = this.state.list.slice();
	    let removed = removeFromArray.splice(thisKey, 1);
	    let getBasket = this.state.inBasket;
	    if('user' in removed[0]){
	    	let wholeBasket = getBasket.push({name:removed[0].name, amount:removed[0].amount, user:removed[0].user})
	    }else{
	    	let wholeBasket = getBasket.push({name:removed[0].name, amount:removed[0].amount})
	    }
	    
	    this.setState({list: removeFromArray});
	}
	removeBasketItem(thisKey){
		let removeFromArray = this.state.inBasket.slice();
	    let removed = removeFromArray.splice(thisKey, 1);
	    let getList = this.state.list;
	    if('user' in removed[0]){
	    	let wholeList = getList.push({name:removed[0].name, amount:removed[0].amount, user:removed[0].user})
	    }else{
	    	let wholeList = getList.push({name:removed[0].name, amount:removed[0].amount})
	   	}
	    this.setState({inBasket: removeFromArray});
	}
	removeUser(thisKey) {
		let removeFromArray = this.state.users.slice();
	    let removed = removeFromArray.splice(thisKey, 1);
	    let list = this.state.list;
	    let basketList = this.state.inBasket;
	    let newList = this.findAllInstancesOfUser(list, removed[0].name);
	    let newBasket = this.findAllInstancesOfUser(basketList, removed[0].name);
	    this.setState({users: removeFromArray, list: newList, inBasket: newBasket});
	}
	addUser(){
		let addToArray = this.state.users;
		addToArray.push({name:this.state.user});
		this.setState({user: ''});
	}
	assignUser(thisKey){
		this.setState({assginUser: true, listIndex: thisKey});
	}
	connectUser(selectedUser){
	    let getlist = this.state.list
	    let pushThis = getlist.push({name:getlist[this.state.listIndex].name, amount:getlist[this.state.listIndex].amount, user:selectedUser});
	    let removeFromArray = getlist.slice();
	    let removed = removeFromArray.splice(this.state.listIndex, 1);
	    this.setState({list: removeFromArray, assginUser: false, listIndex:-1});
	}
	removeAssigned(thisKey, listType){
		let getlist;
		if(listType == 'list'){
			getlist = this.state.list;
		}else{
			getlist = this.state.inBasket;
		}
		console.log(getlist);
	    let pushThis = getlist.push({name:getlist[thisKey].name, amount:getlist[thisKey].amount});
	    let removeFromArray = getlist.slice();
	    let removed = removeFromArray.splice(thisKey, 1);
	    this.setState({[listType]: removeFromArray});
	}
	findAllInstancesOfUser(list, item){
		console.log(item)
		let removefromList = list.slice();
		let newList = [];
		for(let i = removefromList.length -1 ; i > -1; i--) {
		    if(removefromList[i].user == item){
		        let removed = removefromList.splice(i, 1);
		        newList.push({name:removed[0].name, amount:removed[0].amount});
		    }else if(removefromList[i].user != item){
		    	if('user' in removefromList[i]){
			        newList.push({name:removefromList[i].name, amount:removefromList[i].amount, user:removefromList[i].user});
			    }else{
			    	newList.push({name:removefromList[i].name, amount:removefromList[i].amount});
			    }
		    }
		}
		return newList;
	}
	render(){
		return(
			<div className="bsk-entire-app">
				<h1>Basket</h1>
				<div className="bsk-basket">
					<ul>
						<BasketItem 
							removeBasketItem={this.removeBasketItem.bind(this)} 
							inBasket={this.state.inBasket}
							removeAssigned={this.removeAssigned.bind(this)}
						/>
					</ul>
				</div>
				<hr />
				<div className="bsk-list-container">
					<h2>List</h2>
					<div className="bsk-list">
						<ul>
				        	<Item 
				        		removeItem={this.removeItem.bind(this)} 
				        		list={this.state.list} 
				        		addBasket={this.addBasket.bind(this)} 
				        		assignUser={this.assignUser.bind(this)} 
				        		users={this.state.users.length}
				        		currlistIndex={this.state.listIndex}
				        		removeAssigned={this.removeAssigned.bind(this)}
				        	/>
							<EmptyItem 
								listenToInput={this.listenToInput.bind(this)} 
								addItem={this.addItem.bind(this)}
								itemName={this.state.itemName}
		    					itemAmount={this.state.itemAmount}
							 />
						</ul>
						<div className="bsk-error">{this.state.error}</div>
					</div>
				</div>
				<div className="bsk-user-container">
					<h2>Users</h2>
						<ul>
				        	<User 
					        	removeUser={this.removeUser.bind(this)} 
					        	users={this.state.users} 
					        	assginUser={this.state.assginUser} 
					        	connectUser={this.connectUser.bind(this)}
				        	/>
							<EmptyUser 
									listenToInput={this.listenToInput.bind(this)} 
									addUser={this.addUser.bind(this)}
									user={this.state.user}
								/>
						</ul>
				</div>
			</div>
		) 
	}
}

render(<App/>, document.getElementById('app'));