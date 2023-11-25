from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import Message
import pymongo


bot = Bot(token='6491815732:AAHTuAByR8U_faEIZENGUDjDr_WAzp5B294')
dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: types.Message):
    await message.answer("hello")


DB_URL = 'mongodb+srv://admin:admin123@test.ivw9qsv.mongodb.net/?retryWrites=true&w=majority'
CLUSTER = pymongo.MongoClient(DB_URL)
DB = CLUSTER["test"]
COLLECTION = DB["leaders"]


def check_user(coll, name):
    return list(coll.find({'name': name}))




