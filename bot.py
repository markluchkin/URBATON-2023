import asyncio
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message, ContentType
import pymongo


bot = Bot(token='6875301246:AAG1iF7Hf_zTGy5X872Ewly8YkZyTbBpH54')
dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message):
    user_full_name = message.from_user.full_name
    await message.answer(f"Здравствуйте, {user_full_name}. Чтобы продолжить, введите ваш логин и пароль через пробел.")


@dp.message()
async def authorize(message: Message):
    login, password = message.text.split()
    if check_user(COLLECTION, login, password):
        await message.answer(text="Авторизация прошла успешно")
    else:
        await message.answer(text="Не удалось авторизоваться")


DB_URL = 'mongodb+srv://admin:admin123@test.ivw9qsv.mongodb.net/?retryWrites=true&w=majority'
CLUSTER = pymongo.MongoClient(DB_URL)
DB = CLUSTER["test"]
COLLECTION = DB["leaders"]


async def main() -> None:
    # Initialize Bot instance with a default parse mode which will be passed to all API calls
    # And the run events dispatching
    await dp.start_polling(bot)


def check_user(coll, login, password):
    return list(coll.find({'email': login, 'password': password}))


if __name__ == '__main__':
    asyncio.run(main())

