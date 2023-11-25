import asyncio
import pymongo
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from config import TOKEN, DB_URL


bot = Bot(token=TOKEN)
dp = Dispatcher()
CLUSTER = pymongo.MongoClient(DB_URL)
DB = CLUSTER["test"]


@dp.message(CommandStart())
async def start(message: Message):
    user_full_name = message.from_user.full_name
    await message.answer(f"Здравствуйте, {user_full_name}. \n"
                         f"Чтобы продолжить, введите: /auth <ваш логин> <ваш пароль>. \n"
                         f"Пример: /auth qwerty@gmail.com qwerty123")


@dp.message(Command('auth'))
async def authorize(message: Message):
    text = message.text.split()
    login, password = text[1], text[2]
    check = check_user(DB, login, password)
    if check:
        await message.answer(text="Авторизация прошла успешно")
        print(check[0]['organization'])
        is_user_authorized = True
    else:
        await message.answer(text="Не удалось авторизоваться")


async def main() -> None:
    # Initialize Bot instance with a default parse mode which will be passed to all API calls
    # And the run events dispatching
    await dp.start_polling(bot)


def check_user(db, login, password):
    for coll in db.list_collection_names():
        collection = db[coll]
        check = list(collection.find({'email': login, 'password': password}))
        if check:
            return check
    return


if __name__ == '__main__':
    asyncio.run(main())

