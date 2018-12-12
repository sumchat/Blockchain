const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })
    
    describe('can create a star', () => { 
        
        it('can create a star and get its name', async function () { 
            
            await this.contract.createStar("awesome star!","121.874","245.978","032.155","I love my star", 1, {from: accounts[0]})
            let star = await this.contract.tokenIdToStarInfo(1)
            console.log(star)  
            
            //console.log(star)          
            //["Star power 103!", "I love my wonderful star", "ra_032.155", "dec_121.874", "mag_245.978"]
            assert.deepEqual(star, ['awesome star!','I love my star',"ra_032.155", "dec_121.874", "mag_245.978"])
           // assert.equal((star[0],star[1],star[2],star[3],star[4]), ('awesome star!','I love my star',"ra_032.155", "dec_121.874", "mag_245.978"))
        })
        it('Check Error when tokenId does not exist', async function(){
            try {
                await this.contract.tokenIdToStarInfo(2);
            } catch (e) {
                assert.equal(e.message.includes("ERROR: This token does not exists"),true);
                //assert.equal(e.message.includes("ERROR: This token does not exists"), true);
            }
        });
    }) 
    describe('check if star exists', () => { 
        
        it('can check if a star exists', async function () { 
            await this.contract.createStar("awesome star!","121.874","245.978","032.155","I love my star", 1, {from: accounts[0]})
            let doesExist = await this.contract.checkIfStarExists("121.874","245.978","032.155")            

            assert.equal(doesExist,true)
            assert.equal(await this.contract.checkIfStarExists("121.874","245.978","030.155"),false)
        })
    }) 

    

    describe('buying and selling stars', () => { 
        let user1 = accounts[1]
        let user2 = accounts[2]
        let randomMaliciousUser = accounts[3]
        
        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () { 
            await this.contract.createStar("awesome star!","121.874","245.978","032.155","I love my star",starId, {from: user1})
               
        })

        it('user1 can put up their star for sale', async function () { 
            assert.equal(await this.contract.ownerOf(starId), user1)
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
            assert.equal(await this.contract.starsForSale(starId), starPrice)
        })

        it('stars available for sale', async function () { 
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            let tkns = await this.contract.StarsForSale()
           let tkns1 =  tkns.map(x => x.toNumber());
            console.log(tkns1)
            assert.deepEqual(tkns1, [1])
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function() { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })
})