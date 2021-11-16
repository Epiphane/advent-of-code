from concurrent import futures
import hashlib

def stuffit(input_begin, hash_begin, range):
    for i in range:
        digest = hashlib.md5((input_begin + str(i)).encode())
        result = digest.hexdigest()
        if result[:len(hash_begin)] == hash_begin:
            print('input', input_begin + str(i))
            print('result', result)

def find_stuffer(input_begin, hash_begin, nmax):
    threads = 6
    with futures.ProcessPoolExecutor(max_workers=threads) as executor:
        stuffed_futures = []
        for thread in range(threads):

            # using steps to devise the ranges between threads
            r = range(1 + thread, 10**nmax + thread, threads)
            f = executor.submit(stuffit, input_begin, hash_begin, r)

            stuffed_futures.append(f)
        futures.wait(stuffed_futures, return_when=futures.ALL_COMPLETED)

# search range will iterate up to 10 ** nmax
# 7 is enough to find the fisrt '000000' md5
find_stuffer('iwrupvqb', '000000', 7)