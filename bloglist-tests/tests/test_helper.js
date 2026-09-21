import { expect, request } from '@playwright/test'

const BACKEND_URL = 'http://localhost:3001'

const getApi = async page => {
  if (page?.request) {
    return {
      api: page.request,
      shouldDispose: false,
    }
  }

  return {
    api: await request.newContext(),
    shouldDispose: true,
  }
}

export const resetDatabase = async () => {
  const { api, shouldDispose } = await getApi()

  const response = await api.post(
    `${BACKEND_URL}/api/testing/reset`
  )

  expect(response.ok()).toBeTruthy()

  if (shouldDispose) {
    await api.dispose()
  }
}

export const createUser = async (
  pageOrUser,
  userMaybe
) => {
  const user = userMaybe || pageOrUser

  const { api, shouldDispose } = await getApi(
    userMaybe ? pageOrUser : null
  )

  const response = await api.post(
    `${BACKEND_URL}/api/users`,
    {
      data: user,
    }
  )

  if (!response.ok()) {
    console.log(
      'createUser failed:',
      response.status(),
      await response.text()
    )
  }

  expect(response.ok()).toBeTruthy()

  const createdUser = await response.json()

  if (shouldDispose) {
    await api.dispose()
  }

  return createdUser
}

export const apiLogin = async (
  pageOrUsername,
  userOrPassword
) => {
  let username
  let password
  let page = null

  if (typeof pageOrUsername === 'string') {
    username = pageOrUsername
    password = userOrPassword
  } else {
    page = pageOrUsername
    username = userOrPassword.username
    password = userOrPassword.password
  }

  const { api, shouldDispose } = await getApi(page)

  const response = await api.post(
    `${BACKEND_URL}/api/login`,
    {
      data: {
        username,
        password,
      },
    }
  )

  if (!response.ok()) {
    console.log(
      'apiLogin failed:',
      response.status(),
      await response.text()
    )
  }

  expect(response.ok()).toBeTruthy()

  const data = await response.json()

  if (shouldDispose) {
    await api.dispose()
  }

  return {
    token: data.token,
    username: data.username,
    name: data.name,
  }
}

export const login = async (page, user) => {
  await page.getByRole('link', {
    name: 'login',
    exact: true,
  }).click()

  await page.getByLabel('username').fill(
    user.username
  )

  await page.getByLabel('password').fill(
    user.password
  )

  await page.getByRole('button', {
    name: /login/i,
  }).click()

  await expect(
    page.getByText(/logged in/i).first()
  ).toBeVisible()
}

export const createBlogViaApi = async (
  pageOrBlog,
  tokenOrBlog,
  blogMaybe
) => {
  let page = null
  let token
  let blog

  /*
    Supports:

    createBlogViaApi(blog, token)

    AND

    createBlogViaApi(page, token, blog)
  */

  if (blogMaybe !== undefined) {
    page = pageOrBlog
    token = tokenOrBlog
    blog = blogMaybe
  } else {
    blog = pageOrBlog
    token = tokenOrBlog
  }

  const { api, shouldDispose } = await getApi(page)

  const response = await api.post(
    `${BACKEND_URL}/api/blogs`,
    {
      data: blog,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok()) {
    console.log(
      'createBlogViaApi failed:',
      response.status(),
      await response.text()
    )
  }

  expect(response.ok()).toBeTruthy()

  const createdBlog = await response.json()

  if (shouldDispose) {
    await api.dispose()
  }

  return createdBlog
}

export const createBlog = async (
  blog,
  token
) => {
  return createBlogViaApi(blog, token)
}