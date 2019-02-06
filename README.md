# fastPanel Redis.
Extension to work with the "Redis" service.

---

## Env

```
  # Defines the redis environment.
  # Can be: "default", "cluster".
  REDIS_TYPE='default'

  # For default.
  REDIS_HOST='127.0.0.1'
  REDIS_PORT=6379

  # For cluster.
  REDIS_HOSTS='192.168.1.2:6379;192.168.1.3:6379'

  # For all types.
  REDIS_OPTIONS_FAMILY=4
  REDIS_OPTIONS_PASSWORD=''
  REDIS_OPTIONS_DB=0
  REDIS_OPTIONS_KEY_PREFIX='fastpanel:'
```

---

## License
The MIT License (MIT)

---

## Copyright
(c) 2018 - 2019 Desionlab
